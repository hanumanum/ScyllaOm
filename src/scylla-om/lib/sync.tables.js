const { ConsistenciesENUM, WithDropTableENUM } = require("./enums");
const { cqlCreateTableFromSchema, cqlDropTableBySchema, cqlTableInfo } = require("./cql");
const { rawQuery, streamQuery } = require("./raw.query");
const { removeFieldsNotInScheme } = require("./schema");

const areDefinitionsDifferent = (DBTableColumns, schema) => {
    const DBTableColumnData = DBTableColumns.rows.map((row) => JSON.parse(row['[json]']))

    const SchemaTableColumnData = Object
        .keys(schema.fields)
        .map((key) => {
            const fieldName = schema.fields[key].field
            const indexInClusteringOrders = schema.primaryKey.orderingKeys.indexOf(fieldName)
            const idenifyFieldType = (fieldName) => {
                if (schema.primaryKey.partitionKeys.includes(fieldName)) return 'partition_key'
                if (schema.primaryKey.orderingKeys.includes(fieldName)) return 'clustering'
                return 'regular'
            }

            return {
                column_name: fieldName,
                clustering_order: schema.primaryKey.orderingKeyOrders[indexInClusteringOrders] || 'NONE',
                kind: idenifyFieldType(fieldName),
                type: schema.fields[key].type.toLowerCase()
            }
        })


    const changedFields = (SchemaTableColumn) => {
        const column_name = SchemaTableColumn.column_name
        const kind = SchemaTableColumn.kind
        const type = SchemaTableColumn.type
        const clustering_order = SchemaTableColumn.clustering_order

        const found = DBTableColumnData.find((DBTableColumn) => {
            return DBTableColumn.column_name === column_name
                && DBTableColumn.kind === kind
                && DBTableColumn.type === type
                && DBTableColumn.clustering_order === clustering_order
        })

        return !found
    }

    const difference = SchemaTableColumnData.filter(changedFields)
    return difference.length > 0
}

const copyFTTT = (client) => async (fromTable, toTable, fnTransform) => {
    const _rawQuery = rawQuery(client)
    const _streamQuery = streamQuery(client)

    try {
        const copyRow = async (row) => {
            const rowValue = fnTransform(JSON.parse(row['[json]']))
            await _rawQuery(`INSERT INTO ${toTable} JSON '${JSON.stringify(rowValue)}';`, [], ConsistenciesENUM.localQuorum)
        }
        const streamEnd = () => console.log(`copying from ${fromTable} to ${toTable} ended`);

        await _streamQuery(`SELECT JSON * FROM ${fromTable}`, [], ConsistenciesENUM.localQuorum, copyRow, streamEnd)
    }
    catch (err) {
        console.error(err)
    }
}

const syncSchema = (keyspace, schema) => (client) => async () => {
    const _rawQuery = rawQuery(client)
    const _copyFTTT = copyFTTT(client)

    const tableInfo = cqlTableInfo(keyspace, schema.tableName)
    const DBTableColumns = await _rawQuery(tableInfo.query, tableInfo.params, ConsistenciesENUM.all)
    const createTableCQL = cqlCreateTableFromSchema(schema)

    try {
        if (DBTableColumns.rows.length === 0) {
            await _rawQuery(createTableCQL.query, createTableCQL.params, ConsistenciesENUM.localQuorum)
            return;
        }

        if (!areDefinitionsDifferent(DBTableColumns, schema)) {
            return
        }

        const tmpTableName = `${keyspace}.${schema.tableName}_tmp_migration_${Date.now()}`;
        const schemaTableName = `${keyspace}.${schema.tableName}`

        const TableDefinition = await _rawQuery(`describe table ${schema.tableName};`, [], ConsistenciesENUM.localQuorum)
        const TableDefinitionCQLOld = TableDefinition.rows[0].create_statement;
        const TableDefinitionCQLTMP = TableDefinitionCQLOld.replace(`CREATE TABLE ${schemaTableName}`, `CREATE TABLE ${tmpTableName}`);

        await _rawQuery(TableDefinitionCQLTMP, [], ConsistenciesENUM.localQuorum)

        await _copyFTTT(schemaTableName, tmpTableName, (val) => val)

        await _rawQuery(`DROP TABLE ${schemaTableName};`, [], ConsistenciesENUM.localQuorum)

        await _rawQuery(createTableCQL.query, createTableCQL.params, ConsistenciesENUM.localQuorum)

        await _copyFTTT(tmpTableName, schemaTableName, removeFieldsNotInScheme(schema))

    }
    catch (err) {
        console.error(err)
        console.error('error in syncSchema')
        //TODO: rollback
        /*      await _rawQuery(`DROP TABLE IF EXISTS ${schema.tableName};`, [], ConsistenciesENUM.localQuorum)
                await _rawQuery(TableDefinitionCQLOld, [], ConsistenciesENUM.localQuorum)
                const copyRowBack = async (row) => {
                    await _rawQuery(`INSERT INTO ${schema.tableName} JSON '${JSON.stringify(row)}';`, [], ConsistenciesENUM.localQuorum)
                }
                const streamBackEnd = () => console.log('data restored');
                await _streamQuery(`SELECT JSON * FROM ${tmpTableName}`, [], ConsistenciesENUM.localQuorum, copyRowBack, streamBackEnd)
         */
    }
}

const createTables = (client) => async (schemasMap, withDrop) => {
    try {
        const schemaList = Object
            .keys(schemasMap)
            .reduce((acc, schema) => {
                acc.push(schemasMap[schema])
                return acc
            }, [])

        const cqlsCreate = schemaList.map(cqlCreateTableFromSchema);
        const cqlsDrop = schemaList.map(cqlDropTableBySchema)

        if (withDrop === WithDropTableENUM.withDrop) {
            await Promise.all(cqlsDrop.map(async (cql) => await rawQuery(client)(cql.query, cql.params, ConsistenciesENUM.localQuorum)))
        }

        await Promise.all(cqlsCreate.map(async (cql) => await rawQuery(client)(cql.query, cql.params, ConsistenciesENUM.localQuorum)))
    }
    catch (err) {
        console.error(err)
    }
}

module.exports = {
    syncSchema,
    copyFTTT
}