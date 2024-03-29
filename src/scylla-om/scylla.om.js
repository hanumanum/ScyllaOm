const { isSchemaValid } = require("./lib/schema")
const { findInstanceIn } = require("./lib/instance")

const cassandra = require('cassandra-driver');
const { ConsistenciesENUM, WithDropTableENUM } = require("./lib/enums");

const { rawQuery, streamQuery } = require("./lib/raw.query");
const { createTables } = require("./lib/sync.tables");
const { upsertOne, deleteByPK, findOneByPK, bulkUpsert } = require("./lib/methods");

const ScyllaOM = async (scyllaConfig) => {
    let client = null

    const getClient = async (keyspace) => {
        try {
            if (client)
                return client

            const confWithKeyspace = {
                ...scyllaConfig,
                keyspace: keyspace
            }
            client = new cassandra.Client(confWithKeyspace);
            return client;
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }

    client = await getClient(scyllaConfig.keyspace)

    const setSchema = (schema) => {
        if (!isSchemaValid(schema)) {
            //TODO: make error message more informative, that is invalid ?
            throw new Error("Invalid schema")
        }

        return {
            upsertOne: upsertOne(schema)(client),
            deleteByPK: deleteByPK(schema)(client),
            findOneByPK: findOneByPK(schema)(client),
            bulkUpsert: bulkUpsert(schema)(client),
        }
    }

    return {
        setSchema,
        createTables: createTables(client),
        rawQuery: rawQuery(client),
        streamQuery: streamQuery(client)
    }
}


ScyllaOM.Utils = {
    findInstanceIn
}

module.exports = {
    ScyllaOM,
    ConsistenciesENUM,
    WithDropTableENUM
}