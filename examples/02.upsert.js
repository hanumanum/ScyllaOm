const { ScyllaOM, ConsistenciesENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');

//As in schema
const userPK = {
    user_id: 1,
    name: 'test-user',
}

const user = {
    ...userPK,    
    nick_names: ['nick1', 'nick2'],
    created_at: new Date(),
    updated_at: new Date()
}

const update = {
    ...userPK,
    nick_names: ['nick11', 'nick22', 'nick33'],
    updated_at: new Date()
}

const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig);
    const Users = scyllaOm.setSchema(Schemas.UsersExample)

    await Users
        .upsertOne(user, ConsistenciesENUM.localQuorum)

    const userFound = await Users.findOneByPK(userPK, ConsistenciesENUM.localQuorum)

    const updatedUser = {
        userFound,
        ...update
    }

    await Users
        .upsertOne(updatedUser, ConsistenciesENUM.localQuorum)

    const updatedUserFound = await Users.findOneByPK(userPK, ConsistenciesENUM.localQuorum)

    console.log(userFound.nick_names, userFound.updated_at)
    console.log(updatedUserFound.nick_names, updatedUserFound.updated_at)
    process.exit(0)
}

main()
