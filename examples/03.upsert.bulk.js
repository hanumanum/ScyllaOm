const { ScyllaOM, ConsistenciesENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');

const getRanomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

const users = Array(20).fill(0).map((_, i) => ({
    user_id: i,
    name: `bulk-user${i}`,
    nick_names: [getRanomString(5), getRanomString(5)],
    category_id: i % 10,
    created_at: new Date(),
    updated_at: new Date()
}))

const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig);
    const User = scyllaOm.setSchema(Schemas.UsersExample)

    await User.bulkUpsert(users, 100, ConsistenciesENUM.localQuorum)
    
    console.log('bulk upserted')
    process.exit(0)
}

main()
