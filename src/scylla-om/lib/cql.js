
const cqlTableInfo = (keyspace, tableName) => {
    const query = `SELECT JSON column_name, clustering_order, kind, type  
                 FROM system_schema.columns 
                 WHERE keyspace_name = ? AND table_name = ?`;
    return {
        query,
        params: [keyspace, tableName]
    }
}

const cqlDropTableBySchema = (schema) => {
    const dropCQL = `DROP TABLE IF EXISTS ${schema.tableName};`
    return {
        query: dropCQL,
        params: []
    }
}

const cqlCreateTableFromSchema = (schema) => {
    const composeKeysWitTypes = (key) => `${key} ${schema.fields[key].type}`

    let clusteringOrder = (schema.primaryKey.orderingKeys)
        ? schema.primaryKey.orderingKeys.map((key, index) => `${key} ${schema.primaryKey.orderingKeyOrders[index]}`).join(', ') 
        : ''

    clusteringOrder = (clusteringOrder) ? ` WITH CLUSTERING ORDER BY (${clusteringOrder})` : ''

    const keysWithTypes = Object
        .keys(schema.fields)
        .map(composeKeysWitTypes)
        .join(', ')
    
    
    const createCQL = `CREATE TABLE ${schema.tableName} (${keysWithTypes}, 
                        PRIMARY KEY((${schema.primaryKey.partitionKeys.join(', ')}), ${schema.primaryKey.orderingKeys.join(', ')}))
                        ${clusteringOrder} ;`

    return {
        query: createCQL,
        params: []
    }
}

const cqlForDeleteOne = (instance) => {
    const primaryKeys = [...instance.primaryKey.partitionKeys, ...instance.primaryKey.orderingKeys]

    const onlyPrimaryKeyObjects = primaryKeys.map((key) => instance.fields[key])
    const conditionString = primaryKeys.map((key) => `${key} = ?`).join(' AND ')
    //TODO: Do not remove, this is for dubuging resons
    //const conditionStringWithValues = primaryKeys.map((key) => `${key} = ${instance.fields[key].value}`).join(' AND ')
    const fieldValues = onlyPrimaryKeyObjects.map((field) => field.value)
    const query = `DELETE FROM ${instance.tableName} WHERE ${conditionString}`;

    return {
        query,
        params: fieldValues
    }
}

const cqlForSelectOne = (instance) => {
    const primaryKeys = [...instance.primaryKey.partitionKeys, ...instance.primaryKey.orderingKeys]

    const onlyPrimaryKeyObjects = primaryKeys.map((key) => instance.fields[key])
    const conditionString = primaryKeys.map((key) => `${key} = ?`).join(' AND ')

    //TODO: Do not remove, this is for dubuging resons
    //const conditionStringWithValues = primaryKeys.map((key) => `${key} = ${instance.fields[key].value}`).join(' AND ')
    const fieldValues = onlyPrimaryKeyObjects.map((field) => field.value)
    const query = `SELECT JSON * FROM ${instance.tableName} WHERE ${conditionString}`;

    return {
        query,
        params: fieldValues
    }
}

const cqlForUpsert = (instance) => {
    const fieldNames = Object.keys(instance.fields).join(', ');
    const fieldValues = Object.values(instance.fields).map((field) => field.value);
    const placeholders = Array.from({ length: fieldValues.length }, () => '?').join(', ');
    const query = `INSERT INTO ${instance.tableName} (${fieldNames}) VALUES (${placeholders});`
    return {
        query,
        params: fieldValues
    }
}

module.exports = {
    cqlCreateTableFromSchema,
    cqlDropTableBySchema,
    cqlForDeleteOne,
    cqlForSelectOne,
    cqlForUpsert,
    cqlTableInfo
}