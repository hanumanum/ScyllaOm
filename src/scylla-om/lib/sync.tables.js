const { ConsistenciesENUM, WithDropTableENUM } = require("./enums");
const { cqlCreateTableFromSchema, cqlDropTableBySchema } = require("./cql");
const { rawQuery } = require("./raw.query");

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

        console.log(withDrop,  WithDropTableENUM.withDrop)
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
    createTables
}