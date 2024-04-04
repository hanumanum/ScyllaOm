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

const titles = ['baba', 'maga', 'dada', 'sabada', 'gamada']

const users = Array(1_000_000).fill(0).map((_, i) => ({
    user_id: i,
    name: `bulk-user${i % 11}`,
    title: titles[i % 5],
    birth_year: 1990 + i % 10,
    salary: 1000 * (i % 10),
    nick_names: [getRanomString(5), getRanomString(5)],
    category_id: i % 10,
    created_at: new Date(),
    updated_at: new Date()
}))

const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig);
    const User = scyllaOm.setSchema(Schemas.UsersExample)
    const chunkSize = 1000

    await User.bulkUpsert(users, chunkSize, ConsistenciesENUM.localQuorum)

    console.log('bulk upserted')
}

main()
