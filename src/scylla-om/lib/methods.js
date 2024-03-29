const { cqlForUpsert, cqlForSelectOne, cqlForDeleteOne } = require("./cql");
const { instantate } = require("./instance");
const { rawQuery, bulkExecute } = require("./raw.query");

const checkBasicInboundArguments = (fnName, schema, data, consistency) => {
    if (!schema) {
        throw new Error(`${fnName}, schema is not set, use setSchema() first`)
    }
    if (!data) {
        throw new Error(`No data provided for ${fnName}`)
    }

    if (!consistency) {
        throw new Error(`consistency is not set for ${fnName}`)
    }
}

const findOneByPK = (schema) => (client) => async (data, consistency) => {
    checkBasicInboundArguments("findOneByPK", schema, data, consistency)

    const instance = instantate(schema)(data);
    const cql = cqlForSelectOne(instance);
    const result = await rawQuery(client)(cql.query, cql.params, consistency);
    if (result.rows.length !== 1)
        return null

    const json = JSON.parse(result.rows[0]['[json]'])
    return json
}


const deleteByPK = (schema) => (client) => async (data, consistency) => {
    try {
        checkBasicInboundArguments("deleteByPK", schema, data, consistency)

        const instance = instantate(schema)(data)
        const cql = cqlForDeleteOne(instance)
        await rawQuery(client)(cql.query, cql.params, consistency)
    }
    catch (err) {
        console.error(err)
    }
}

const upsertOne = (schema) => (client) => async (data, consistency) => {
    try {
        
        checkBasicInboundArguments("upsertOne", schema, data, consistency)
        
        const instance = instantate(schema)(data)
        const cqlUpsert = cqlForUpsert(instance)
        await rawQuery(client)(cqlUpsert.query, cqlUpsert.params, consistency)
    }
    catch (err) {
        throw err;
    }
}

const bulkUpsert = (schema) => (client) => async (dataArray, chunkSize, consistency) => {
    try {

        checkBasicInboundArguments("bulkUpsert", schema, dataArray, consistency)
        
        if (!chunkSize) {
            throw new Error("Upsert chunkSize is not set")
        }

        if (dataArray.length === 0) {
            return
        }

        const queryWithParams = dataArray
            .map(instantate(schema))
            .map(cqlForUpsert)

        await bulkExecute(client)(queryWithParams, chunkSize, consistency)
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    upsertOne,
    deleteByPK,
    findOneByPK,
    bulkUpsert
}