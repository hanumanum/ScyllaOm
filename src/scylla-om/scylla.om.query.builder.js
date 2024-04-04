const { ConsistenciesENUM } = require("./scylla.om")
const { isSchemaValid, checkFieldOverSchema } = require("./lib/schema")
const { ScyllaOM } = require('./scylla.om');

const quotify = (value) => {
    if (typeof value === 'string') {
        return `'${value}'`
    }
    return value
}

const predicateFilter = (predicatesFilter, row) => {
    for (let pf of predicatesFilter) {
        const keyName = Object.keys(pf)[0]
        if (!pf[keyName].includes(row[keyName])) {
            return false
        }
    }
    return true
}

const streamFilter = (predicatesFilter) => {
    const filtered = []
    const collect = (value) => {
        const row = JSON.parse(value['[json]'])

        if (predicateFilter(predicatesFilter, row)) {
            filtered.push(row)
        }
    }

    const result = () => {
        return filtered
    }
    return {
        collect,
        result
    }
}

const projectionFilter = (projections) => {
    const _proj = projections.map(p => p.field)
    return (row) => {
        return _proj.reduce((acc, field) => {
            return {
                ...acc,
                [field]: row[field]
            }

        }, {})
    }
}

const ScyllaOmQueryBuilder = async (scyllaConfig) => {
    const scyllOm = await ScyllaOM(scyllaConfig)
    let _schema = null
    let _primaryKeys = []
    let _table = null
    let _projections = []
    let _predicates = {}

    let _consistency = ConsistenciesENUM.one
    let _countOfWheres = -1

    let _queries = []

    const withConsistency = (consistency) => {
        _consistency = consistency
        return methods
    }

    const select = (...selectFields) => {
        if (!_schema) {
            throw new Error("Schema is not set, use setSchema() first")
        }

        if (selectFields.length === 0) {
            throw new Error("in: select(), provide least one field")
        }

        _projections = selectFields.map(checkFieldOverSchema(_schema, 'select'))

        return methods
    }

    const groupPredicates = (primaryKeys, predicates) => {
        const predicatesPK = []
        const predicatesFilter = []

        //Indenify in order primary key predicates 
        for (var i = 0; i < primaryKeys.length; i++) {
            const pk = primaryKeys[i]
            if (predicates[pk]) {
                predicatesPK.push({ [pk]: predicates[pk] })
            }
            else {
                break;
            }
        }

        //Identify other primary key predicates
        for (var j = i; j < primaryKeys.length; j++) {
            const pk = primaryKeys[j]
            if (predicates[pk]) {
                predicatesFilter.push({ [pk]: predicates[pk] })
            }
        }

        //Identify the rest (non-primary key predicates)
        for (let predicateField in predicates) {
            const item = predicatesPK.find((pf) => pf[predicateField])
                || predicatesFilter.find((pf) => pf[predicateField])

            if (!item) {
                predicatesFilter.push({ [predicateField]: predicates[predicateField] })
            }
        }

        return [predicatesPK, predicatesFilter];
    }

    const collectAllProjections = (projections, predicates) => {
        const projectionsAll = new Set();
        projections.forEach(p => projectionsAll.add(p.field))
        Object.keys(predicates).forEach(p => projectionsAll.add(p))
        return Array.from(projectionsAll)
    }

    const composeQuery = () => {
        const queries = []

        const projectionsAll = collectAllProjections(_projections, _predicates)
        const [predicatesPK, _] = groupPredicates(_primaryKeys, _predicates)

        const where = predicatesPK.map((pk) => {
            const key = Object.keys(pk)[0]
            return `${key} IN (${pk[key].map(quotify).join(',')})`
        })

        //TODO: make queries prepared, not hardcoded
        const cql = `SELECT JSON ${projectionsAll.join(', ')}
                     FROM ${_table}
                     WHERE ${where.join(" AND ")}`

        queries.push(cql)
        return queries;
    }

    const printQuery = () => {
        _queries = composeQuery()
        console.log(_queries)
        return methods
    }


    const whereIn = (property, values) => {
        if (!Array.isArray(values)) {
            throw new Error("in whereIn(): values should be an array")
        }

        _countOfWheres++
        const _property = checkFieldOverSchema(_schema, 'whereIn')(property, _countOfWheres)
        //_predicateFields.push(_property)
        _predicates = { ..._predicates, [_property.field]: values }
        return methods
    }

    const run = async () => {
        if (_queries.length === 0) {
            throw new Error("No query to run")
        }

        const [_, predicatesFilter] = groupPredicates(_primaryKeys, _predicates)
        console.log(predicatesFilter)

        const onlyRequestedProjections = projectionFilter(_projections)
        const filter = streamFilter(predicatesFilter)
        const data = await scyllOm.streamQuery(_queries[0], [], _consistency, filter.collect, filter.result)
        return data.map(onlyRequestedProjections)

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
        _primaryKeys = [..._schema.primaryKey.partitionKeys, ..._schema.primaryKey.orderingKeys]
        _table = _schema.tableName

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