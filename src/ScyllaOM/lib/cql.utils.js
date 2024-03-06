
/**
 * Enumeration for specifying whether to drop a table or not.
 * @enum {number}
 */
const withDropTableENUM = {
    withDrop: 1,
    withoutDrop: 2
}
Object.freeze(withDropTableENUM)

/**
 * Generates a CQL statement for dropping a table if it exists.
 * @param {Object} schema The schema of the table to be dropped, containing the table name.
 * @returns {{query: string, params: Array}} An object with the CQL query to drop the table and an empty parameters array.
 */
const cqlDropTableBySchema = (schema) => {
    const dropCQL = `DROP TABLE IF EXISTS ${schema.tableName};`
    return {
        query: dropCQL,
        params: []
    }
}

/**
 * Generates a CQL statement for creating a table based on the provided schema.
 * @param {Object} schema The schema definition of the table, including fields and primary key.
 * @returns {{query: string, params: Array}} An object with the CQL query to create the table and an empty parameters array.
 */
const cqlCreateTableFromSchema = (schema) => {
    const composeKeysWitTypes = (key) => {
        if (schema.fields[key].frozen) {
            return `${key} FROZEN<${schema.fields[key].type}>`
        }
        else {
            return `${key} ${schema.fields[key].type}`
        }
    }

    const keysWithTypes = Object
        .keys(schema.fields)
        .map(composeKeysWitTypes)
        .join(', ')
    const createCQL = `CREATE TABLE ${schema.tableName} (${keysWithTypes}, PRIMARY KEY((${schema.primaryKey.partitionKeys.join(', ')}), ${schema.primaryKey.orderingKeys.join(', ')}));`

    return {
        query: createCQL,
        params: []
    }
}

/**
 * Generates a CQL statement for deleting a single record identified by its primary key.
 * @param {Object} instance An instance containing the table name, fields, and primary key structure.
 * @returns {{query: string, params: Array}} An object with the CQL query to delete a record and an array of parameters for the query.
 */
const cqlForDeleteOne = (instance) => {
    const primaryKeys = [...instance.primaryKey.partitionKeys, ...instance.primaryKey.orderingKeys]

    const onlyPrimaryKeyObjects = primaryKeys.map((key) => instance.fields[key])
    const conditionString = primaryKeys.map((key) => `${key} = ?`).join(' AND ')
    //TODO: Do not remove, this is for dubuging resons
    //const conditionStringWithValues = primaryKeys.map((key) => `${key} = ${instance.fields[key].value}`).join(' AND ')
    const fieldValues = onlyPrimaryKeyObjects.map((field) => field.value)
    const query = `DELETE FROM ${instance.tableName} WHERE ${conditionString}`;

    return {
        query,
        params: fieldValues
    }
}

/**
 * Generates a CQL statement for selecting a single record by its primary key.
 * @param {Object} instance An instance containing the table name, fields, and primary key structure.
 * @returns {{query: string, params: Array}} An object with the CQL query to select a record and an array of parameters for the query.
 */
const cqlForSelectOne = (instance) => {
    const primaryKeys = [...instance.primaryKey.partitionKeys, ...instance.primaryKey.orderingKeys]

    const onlyPrimaryKeyObjects = primaryKeys.map((key) => instance.fields[key])
    const conditionString = primaryKeys.map((key) => `${key} = ?`).join(' AND ')

    //TODO: Do not remove, this is for dubuging resons
    //const conditionStringWithValues = primaryKeys.map((key) => `${key} = ${instance.fields[key].value}`).join(' AND ')
    const fieldValues = onlyPrimaryKeyObjects.map((field) => field.value)
    const query = `SELECT * FROM ${instance.tableName} WHERE ${conditionString}`;

    return {
        query,
        params: fieldValues
    }
}

/**
 * Generates a CQL statement for upserting a record into a table.
 * @param {Object} instance An instance containing the table name and fields with their values.
 * @returns {{query: string, params: Array}} An object with the CQL query to upsert a record and an array of parameters for the query.
 */
const cqlForUpsert = (instance) => {
    const fieldNames = Object.keys(instance.fields).join(', ');
    const fieldValues = Object.values(instance.fields).map((field) => field.value);
    const placeholders = Array.from({ length: fieldValues.length }, () => '?').join(', ');
    const query = `INSERT INTO ${instance.tableName} (${fieldNames}) VALUES (${placeholders});`
    return {
        query,
        params: fieldValues
    }
}

module.exports = {
    cqlCreateTableFromSchema,
    cqlDropTableBySchema,
    cqlForDeleteOne,
    cqlForSelectOne,
    cqlForUpsert,
    withDropTableENUM
}