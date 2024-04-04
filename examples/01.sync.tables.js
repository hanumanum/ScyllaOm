const { ScyllaOM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');

const main = async () => {

    try {
        const scyllaOm = await ScyllaOM(scyllaConfig);

        const Users = scyllaOm.setSchema(Schemas.UsersExample)
        await Users.syncSchema()

        const Posts = scyllaOm.setSchema(Schemas.PostsExample)
        await Posts.syncSchema()
    }
    catch (err) {
        console.log(err)
    }
}

main()
