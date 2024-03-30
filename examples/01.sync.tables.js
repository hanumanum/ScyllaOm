const { ScyllaOM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');

const main = async () => {

    try {
        const scyllaOm = await ScyllaOM(scyllaConfig);
        await scyllaOm
            .setSchema(Schemas.UsersExample)
            .syncSchema()
        console.log('tables synced')
    }
    catch (err) {
        console.log(err)
    }
}

main()
