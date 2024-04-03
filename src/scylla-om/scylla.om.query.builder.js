const { propVal } = require("./lib/FP")
const { ConsistenciesENUM } = require("./scylla.om")
const { isSchemaValid, checkFieldOverSchema } = require("./lib/schema")

const quotify = (value) => {
    if (typeof value === 'string') {
        return `'${value}'`
    }
    return value
}

const ScyllaOmQueryBuilder = () => {
    throw new Error("Not implemented");
    let _schema = null
    let _primaryKeys = null
    let _table = null
    let _selectCQL = ''
    let _consistency = ConsistenciesENUM.one
    let _whereIns = {}
    let _countOfWheres = -1
    let _allowFiltering = false

    const withConsistency = (consistency) => {
        _consistency = consistency
        return methods
    }

    const select = (...selectFields) => {
        if (!_schema) {
            throw new Error("Schema is not set, use setSchema() first")
        }

        const fieldsVerifyed = selectFields.map(checkFieldOverSchema(_schema, 'select'))

        const fieldsNames = (fieldsVerifyed.length > 0)
            ? fieldsVerifyed
                .map(propVal('field'))
                .join(',')
            : '*'

        _selectCQL = `SELECT ${fieldsNames} FROM ${_table} `

        return methods
    }

    const composeQuery = () => {
        const whereConditions = Object
            .keys(_whereIns)
            .map((field) => {
                const values = _whereIns[field]
                    .map(quotify)
                    .join(",")

                return `${field} IN (${values})`
            })

        const whereCQL = (whereConditions.length > 0)
            ? `WHERE ${whereConditions.join(' AND ')}`
            : ''
        
        const allowFilteringCQL = (_allowFiltering) ? 'ALLOW FILTERING' : '';

        return `${_selectCQL} ${whereCQL} ${allowFilteringCQL}`
    }

    const printQuery = () => {
        console.info(composeQuery())
        return methods
    }

    const allowFiltering = () => {
        _allowFiltering = true
        return methods
    }

    const whereIn = (property, values) => {
        _countOfWheres++
        const _property = checkFieldOverSchema(_schema, 'whereIn')(property, _countOfWheres)
        _whereIns[_property.field] = values
        return methods
    }

    const get = async () => {
        throw new Error("Not implemented")
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
            //TODO: make error messege more informative, that is invalid ?
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
        allowFiltering,
        get,
        first
    }

    return {
        setSchema
    }

}


module.exports = { ScyllaOmQueryBuilder }