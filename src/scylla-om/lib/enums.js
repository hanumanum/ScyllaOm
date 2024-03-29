const cassandra = require('cassandra-driver');

const WithDropTableENUM = {
    withDrop: 1,
    withoutDrop: 2
}
Object.freeze(WithDropTableENUM)

const ConsistenciesENUM = cassandra.types.consistencies

module.exports = {
    WithDropTableENUM,
    ConsistenciesENUM
}