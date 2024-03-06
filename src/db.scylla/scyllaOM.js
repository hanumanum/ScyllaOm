/**
 * @typedef {Object} ScyllaOM
 * @property {function(): Promise} createTables - Creates necessary tables in the database.
 * @property {function(schema: string): Promise} setSchema - Sets the schema for the database operations.
 * @property {function(query: string, parameters?: Array): Promise} rawQuery - Executes a raw SQL query on the database.
 * @property {function(query: string, parameters?: Array): Stream} streamQuery - Streams the results of a query.
 */


const { isSchemaValid, deepClone, withTimeLog, chunkify, isPlainObject } = require("./lib/utils")
const { cqlCreateTableFromSchema,
    cqlForDeleteOne,
    cqlForSelectOne,
    cqlForUpsert,
    cqlDropTableBySchema,
    withDropTableENUM
} = require("./lib/cql.utils")
const cassandra = require('cassandra-driver');
const scyllaConfig = require('./scylla.config')
const KEYSPACE = 'powerdmarc';

const ConsistenciesENUM = cassandra.types.consistencies

/**
 * Finds a specific instance in a list of instances.
 * @param {Array} instances - The list of instances.
 * @param {Object} instance - The instance to find.
 * @returns {Object|null} The found instance or null if not found.
 */
const findInstanceIn = (instances, instance) => {
    return instances.find((inst) => inst.primaryKeyId === instance.primaryKeyId) || null
}

let client = null

/**
 * Creates or retrieves a singleton Cassandra client instance for the specified keyspace.
 * @param {string} keyspace - The keyspace name to connect to.
 * @returns {Promise<cassandra.Client|null>} A promise that resolves with the Cassandra client or null in case of error.
 */
const getClient = async (keyspace) => {
    try {
        if (client)
            return client

        const confWithKeyspace = {
            ...scyllaConfig,
            keyspace: keyspace
        }
        client = new cassandra.Client(confWithKeyspace);
        console.log("Connected to ScyllaDB")
        return client;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}


/**
 * Initializes and manages Scylla Object Mapping functionalities.
 * @returns Promise<{{
 *   createTables: function(): Promise<any>,
 *   setSchema: function(schema: string): Promise<any>,
 *   rawQuery: function(query: string, parameters?: Array<any>): Promise<any>,
 *   streamQuery: function(query: string, parameters?: Array<any>): Stream
 * }}> An object containing database utility functions. `createTables` creates necessary tables in the database, returns a Promise. `setSchema` sets the schema for the database operations, returns a Promise. `rawQuery` executes a raw SQL query on the database, returns a Promise with the query results. `streamQuery` streams the results of a query, returns a Stream.
*/
const ScyllaOM = async () => {
    let _schema = null
    let _primaryKeys = null

   const setSchema = (schema) => {
        if (!isSchemaValid(schema)) {
            //TODO: make error messege more informative, that is invalid ?
            throw new Error("Invalid schema")
        }
        _schema = schema
        _primaryKeys = [..._schema.primaryKey.partitionKeys, ..._schema.primaryKey.orderingKeys]
        return {
            deleteByPK,
            bulkUpsert,
            bulkUpsertWithMerge
        }
    }

    const client = await getClient(KEYSPACE)

    /**
     * Instantiates a new object based on the schema and data provided.
     * @param {Object} data - The data to instantiate the object with.
     * @throws {Error} If the data is not an object or missing required fields.
     * @returns {Object} The instantiated object.
     */
    const instantate = (data) => {
        if (!isPlainObject(data)) {
            throw new Error(`${_schema.tableName} Cannot instantate, argument is not an object`);
        }

        const findMissingFields = (data) => _primaryKeys.filter((key) => data[key] === undefined || data[key] === null)
        const keysFromSchema = (key) => (key in _schema.fields)

        const calcPrimaryKeyId = (data) => {
            return _primaryKeys
                .reduce((acc, key) => {
                    acc += '_' + key + '_' + JSON.stringify(data[key])
                    return acc
                }, '')
        }

        const addValues = (acc, key) => {
            acc[key] = {
                ..._schema.fields[key],
                value: data[key]
            }
            return acc
        }

        const missingFields = findMissingFields(data)
        if (missingFields.length > 0) {
            throw new Error(`Cannot create instance. ${_schema.tableName}\n All fields in primary key required and should have values, missing keys are \n${missingFields.join("\n,")}`)
        }

        const fields = Object
            .keys(data)
            .filter(keysFromSchema)
            .reduce(addValues, {})

        const instance = deepClone(_schema)
        instance.fields = fields
        instance.primaryKeyId = calcPrimaryKeyId(data)

        return instance
    }

    /**
    * Creates tables based on a list of schemas, with an optional step to drop existing tables first.
    * @param {Array} schemaList - A list of schemas based on which tables will be created.
    * @param {Enumerator withDropTableENUM} withDrop - Whether to drop existing tables before creating new ones.
    */
    const createTables = async (schemaList, withDrop) => {
        try {
            const cqlsCreate = schemaList.map(cqlCreateTableFromSchema);
            const cqlsDrop = schemaList.map(cqlDropTableBySchema)

            if (withDrop === withDropTableENUM.withDrop) {
                await Promise.all(cqlsDrop.map(async (cql) => await rawQuery(cql.query, cql.params, ConsistenciesENUM.localQuorum)))
            }

            await Promise.all(cqlsCreate.map(async (cql) => await rawQuery(cql.query, cql.params, ConsistenciesENUM.localQuorum)))
        }
        catch (err) {
            console.error(err)
        }
    }

    /**
     * Executes a raw CQL query with specified parameters and consistency level.
     * @param {string} query - The CQL query to execute.
     * @param {Array} params - The parameters for the query.
     * @param {cassandra.consistencies} consistency - The consistency level for the query.
     * @returns {Promise<Object|null>} The result of the query or null in case of error.
     */
    const rawQuery = async (query, params, consistency) => {
        try {
            const options = {
                prepare: true,
                consistency: consistency
            }

            return await client.execute(query, params, options)
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }

    /**
     * Streams a CQL query, processing rows as they are read by doOnRow() function and performing an action at the end by .
     * @param {string} query - The CQL query to stream.
     * @param {Array} params - The parameters for the query.
     * @param {cassandra.consistencies} consistency - The consistency level for the query.
     * @param {Function} doOnRow - The function to execute on each row as it's read.
     * @param {Function} doOnEnd - The function to execute once all rows have been processed.
     */
    const streamQuery = (query, params, consistency, doOnRow, doOnEnd) => {
        const options = {
            prepare: true,
            consistency: consistency
        }

        client.stream(query, params, options)
            .on('readable', async function () {
                let row;
                while (row = this.read()) {
                    await doOnRow(row)
                }
            })
            .on('end', doOnEnd)
            .on('error', (err) => {
                console.error(err)
            })
    }

    /**
     * Deletes a record by its primary key using the provided consistency level.
     * @param {Object} data - The primary key data used to identify the record to delete.
     * @param {number} consistency - The consistency level for the deletion query.
     * @returns {Promise<Object|null>} The result of the delete operation or null in case of error.
     */
    const deleteByPK = (data, consistency) => {
        try {
            const instance = instantate(data)
            const cql = cqlForDeleteOne(instance)
            rawQuery(cql.query, cql.params, consistency)
        }
        catch (err) {
            console.error(err)
        }
    }

    /**
     * Executes a bulk set of queries with specified parameters and consistency level.
     * @param {Array} queriesWithParams - An array of query and parameter pairs to execute.
     * @param {number} consistency - The consistency level for the queries.
     * @returns {Promise<Array>} An array of query results.
     */
    const bulkExecute = async (queriesWithParams, consistency) => {
        const CHUNK_SIZE = 1000
        let data = []
        try {
            //TODO: shuld we use this method ?
            //cassandra.concurrent.executeConcurrent()

            const chunks = chunkify(queriesWithParams, CHUNK_SIZE)

            for (let chunk of chunks) {
                const chunksData = await Promise.all(chunk.map(({ query, params }) => rawQuery(query, params, consistency)))
                data = [...data, ...chunksData]
            }

            delete chunks;
            return data
        }
        catch (err) {
            console.log(data)
            console.error(err)
            return []
        }
    }

    /**
     * Performs a bulk upsert operation for a given array of data, using the specified consistency level.
     * @param {Array} dataArray - The data to upsert.
     * @param {number} consistency - The consistency level for the upsert queries.
    */
    const bulkUpsert = async (dataArray, consistency) => {
        if (!_schema) {
            throw new Error("Schema is not set, use setSchema() first")
        }

        if (dataArray.length === 0) {
            return
        }

        const logTitle = `--> bulkUpsert ${dataArray.length} , time`;

        const queryWithParams = dataArray
            .map(instantate)
            .map(cqlForUpsert)

        withTimeLog(async () => {
            await bulkExecute(queryWithParams, consistency)
        }, logTitle);
    }

    /**
     * Performs a bulk upsert operation with merge capabilities for a given array of data, using a transform function and the specified consistency level.
     * @param {Array} dataArray - The data to upsert.
     * @param {number} consistency - The consistency level for the upsert queries.
     * @param {Function} fnTransformBy - A function to transform data before upserting.
     */
    const bulkUpsertWithMerge = async (dataArray, consistency, fnTransformBy) => {
        if (!_schema) {
            throw new Error("Schema is not set, use setSchema() first")
        }

        if (dataArray.length === 0) {
            return
        }

        const _bulkUpsertWithMerge = async () => {
            let result = []

            try {
                const allInstances = dataArray.map(instantate)

                const allCQLs = allInstances.map(cqlForSelectOne)
                result = await bulkExecute(allCQLs, consistency)

                const instancesToUpdate = result
                    .map((res) => res.rows)
                    .flat()
                    .map(instantate)

                const notInScyllaDB = (inst) => !instancesToUpdate.some((instToUpdate) => instToUpdate.primaryKeyId !== inst.primaryKeyId)
                const instancesToInsert = allInstances.filter(notInScyllaDB);

                const transfomredInstancesToUpdate = (fnTransformBy) ? fnTransformBy(instancesToUpdate, allInstances, _schema) : instancesToUpdate

                const queryesWithParams = [...instancesToInsert, ...transfomredInstancesToUpdate].map(cqlForUpsert)
                await bulkExecute(queryesWithParams, consistency)
            }
            catch (err) {
                console.error(err)
                console.log(result)
                process.exit(0)
            }
        }

        const logTitle = `--> bulkUpsertWithMerge ${dataArray.length} , time`;
        withTimeLog(_bulkUpsertWithMerge, logTitle)
    }

    return {
        createTables,
        setSchema,
        rawQuery,
        streamQuery
    }
}


ScyllaOM.Utils = {
    findInstanceIn
}

module.exports = {
    ScyllaOM,
    ConsistenciesENUM: ConsistenciesENUM
}