const { ScyllaOM, WithDropTableENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');

const main = async () => {

    try{
        const scyllaOm = await ScyllaOM(scyllaConfig);
        await scyllaOm.createTables(Schemas, WithDropTableENUM.withDrop)
        console.log('tables re created')
    }
    catch(err){
        console.log(err)
    }
    process.exit(0)
}

main()
