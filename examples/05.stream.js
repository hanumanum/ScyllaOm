const { ScyllaOM, ConsistenciesENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');


const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig)
    const log = (row) => console.log(JSON.parse(row['[json]']))
    const end = () => console.log('stream ended')

    await scyllaOm.streamQuery(`SELECT JSON * FROM ${Schemas.UsersExample.tableName} LIMIT 10`, [], ConsistenciesENUM.localQuorum, log, end)

}

main()
