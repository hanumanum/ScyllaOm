const { ConsistenciesENUM } = require("./scylla.om")
const { isSchemaValid, checkFieldOverSchema, getPrimaryKeys } = require("./lib/schema")
const { ScyllaOM } = require('./scylla.om');
const { streamFilter, projectionFilter, groupPredicates, quotify, collectAllProjections } = require("./lib/query.builder.utils");


const ScyllaOmQueryBuilder = async (scyllaConfig) => {
    const scyllOm = await ScyllaOM(scyllaConfig)
    let _schema = null
    let _projections = []
    let _predicates = {}

    let _consistency = ConsistenciesENUM.one
    let _countOfWheres = -1

    const withConsistency = (consistency) => {
        _consistency = consistency
        return methods
    }

    const select = (...selectFields) => {
        if (!_schema) {
            throw new Error("Schema is not set, use setSchema() first")
        }

        if (selectFields.length === 0) {
            throw new Error("in: select(), provide at least one field")
        }

        _projections = selectFields.map(checkFieldOverSchema(_schema, 'select'))

        return methods
    }


    const composeQueries = (schema, projections, predicated) => {
        const queries = []

        const primaryKeys = getPrimaryKeys(schema)
        const projectionsAll = collectAllProjections(projections, predicated)
        const [predicatesPK, _] = groupPredicates(primaryKeys, predicated)

        const where = predicatesPK.map((pk) => {
            const key = Object.keys(pk)[0]
            return `${key} IN (${pk[key].map(quotify).join(',')})`
        })

        //TODO: make queries prepared, not hardcoded
        const cql = `SELECT JSON ${projectionsAll.join(', ')}
                     FROM ${schema.tableName}
                     WHERE ${where.join(" AND ")}`

        queries.push(cql)
        return queries;
    }

    const printQuery = () => {
        const queries = composeQueries(_schema, _projections, _predicates)
        console.log(queries)
        return methods
    }

    const whereIn = (property, values) => {
        if (!Array.isArray(values)) {
            throw new Error("in whereIn(): values should be an array")
        }

        _countOfWheres++
        const prop = checkFieldOverSchema(_schema, 'whereIn')(property, _countOfWheres)
        _predicates = { ..._predicates, [prop.field]: values }
        return methods
    }

    const run = async () => {
        const queries = composeQueries(_schema, _projections, _predicates)
        if (queries.length === 0) {
            throw new Error("No query to run")
        }
        //TODO: check all data required for query is set

        const primaryKeys = getPrimaryKeys(_schema)
        const [_, predicatesFilter] = groupPredicates(primaryKeys, _predicates)
        const onlyRequestedProjections = projectionFilter(_projections)
        const filter = streamFilter(predicatesFilter)

        //TODO: this is for future parrallelization
        const data = await Promise.all(queries.map((query) => scyllOm.streamQuery(query, [], _consistency, filter.collect, filter.result)));

        return data.flat().map(onlyRequestedProjections)

    }

    const first = async () => {
        throw new Error("Not implemented")
    }

    const whereEq = (property, value) => {
        throw new Error("Not implemented")
    }

    const whereNonEq = (property, value) => {
        throw new Error("Not implemented")
    }


    const setSchema = (schema) => {
        if (!schema) {
            throw new Error("No Schema set")
        }

        if (!isSchemaValid(schema)) {
            throw new Error("Invalid schema")
        }
        _schema = schema
        return methods
    }

    const methods = {
        select,
        whereIn,
        whereEq,
        whereNonEq,
        withConsistency,
        printQuery,
        first,
        run
    }

    return {
        setSchema
    }

}


module.exports = { ScyllaOmQueryBuilder }