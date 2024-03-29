const { ScyllaOM, ConsistenciesENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');

//As in schema
const userPK = {
    user_id: 1,
    name: 'test-user',
    category_id: 1,
}

const user = {
    ...userPK,
    nick_names: ['nick1', 'nick2'],
    category_id: 1,
    created_at: new Date(),
    updated_at: new Date()
}

const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig)
    const Users = scyllaOm.setSchema(Schemas.UsersExample)

    await Users
        .upsertOne(user, ConsistenciesENUM.localQuorum)

    const userFound1 = await Users
        .findOneByPK(userPK, ConsistenciesENUM.localQuorum)

    await Users
        .deleteByPK(userPK, ConsistenciesENUM.localQuorum)

    //Will be same result as above
    /* await Users
        .deleteByPK(userFound1, ConsistenciesENUM.localQuorum)
    */

    const userFound2 = await Users
        .findOneByPK(userPK, ConsistenciesENUM.localQuorum)

    console.log('user found 1', JSON.stringify(userFound1))
    console.log('user found 2', JSON.stringify(userFound2))
    process.exit(0)
}

main()
