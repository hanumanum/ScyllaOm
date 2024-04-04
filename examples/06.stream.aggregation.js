const { ScyllaOM, ConsistenciesENUM } = require("../src/scylla-om/scylla.om.js");
const scyllaConfig = require('./00.scylla.config.js');
const Schemas = require('./schemas/index.js');


const main = async () => {
    const scyllaOm = await ScyllaOM(scyllaConfig)

    const StreamAggregator = () => {
        let sum = 0;

        const calculate = (row) => {
            const _row = JSON.parse(row['[json]'])
            sum += _row.salary;
        }

        const result = () => {
            return sum;
        }

        return {
            calculate, 
            result
        }
    }

    const aggregate = StreamAggregator()

    const result = await scyllaOm.streamQuery(`SELECT JSON * FROM ${Schemas.UsersExample.tableName} LIMIT 10`, [], ConsistenciesENUM.localQuorum, aggregate.calculate, aggregate.result)
    console.log(result)
}

main()
