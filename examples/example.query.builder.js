//const { migrateRUAForReindex } = require('./migrators/migrate.rua.reports.js');
const { getRanomString } = require('../utils/util.js');
const { ScyllaOM, ConsistenciesENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');
/*
const { QueryBuilder } = require('./scylla-om/scylla.om.query.builder.js');
const Schemas = require('./db.scylla/schemas/');

const RRFields = Schemas.RuaReports.fields;
const query = QueryBuilder()
    .setSchema(Schemas.RuaReports)
    .select(RRFields.account_id
        , RRFields.continent_code
        , RRFields.count_dkim_none
    )
    .whereIn(RRFields.account_id, [1, 2, 3])
    .whereIn(RRFields.address, ['addr1', '5656', 'addrrss'])
    .allowFiltering()
    .printQuery()
*/


const users = Array(100).fill(0).map((_, i) => ({
    user_id: i,
    name: `user${i}`,
    nick_names: [getRanomString(5), getRanomString(5)],
    category_id: i % 10,
    created_at: new Date(),
    updated_at: new Date()
}))

const user = {
    user_id: 1,
    name: 'user1',
    nick_names: ['nick1', 'nick2'],
    category_id: 1,
    created_at: new Date(),
    updated_at: new Date()
}

const user_to_find = {
    user_id: 1,
    name: 'user1',
    category_id: 1,
}

const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig);
    
    await scyllaOm
        .setSchema(Schemas.UsersExample)
        .upsertOne(user, ConsistenciesENUM.localQuorum)

    await scyllaOm
        .setSchema(Schemas.UsersExample)
        .bulkUpsert(users, 100, ConsistenciesENUM.localQuorum)

    const usersFound = await scyllaOm
        .setSchema(Schemas.UsersExample)
        .findOneByPK(user_to_find, ConsistenciesENUM.localQuorum)

    console.log(usersFound)
}

main()
