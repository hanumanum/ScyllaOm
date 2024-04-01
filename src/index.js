const { ScyllaOmQueryBuilder } = require("./scylla-om/scylla.om.query.builder");
const { ScyllaOM, ConsistenciesENUM, WithDropTableENUM } = require("./scylla-om/scylla.om.js");

module.exports = {
    ScyllaOM,
    ScyllaOmQueryBuilder,
    ConsistenciesENUM,
    WithDropTableENUM    
}