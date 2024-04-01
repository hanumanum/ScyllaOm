const { ScyllaOmQueryBuilder } = require("./scylla-om/scylla.om.query.builder");
const { ScyllaOM } = require("./scylla-om/scylla.om.js");
const { ConsistenciesENUM, WithDropTableENUM } = require("./scylla-om/lib/enums");

module.exports = {
    ScyllaOM,
    ScyllaOmQueryBuilder,
    ConsistenciesENUM,
    WithDropTableENUM
}