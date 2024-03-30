const { propVal, objectToArray, deepClone } = require("./FP.js")


/**
 * Checks if the given schema is valid.
 * TODO: Implement the actual validation logic.
 *
 * @param {Object} schema The schema object to validate.
 * @returns {boolean} Always returns true. Implement actual logic for validation.
 */
const isSchemaValid = (schema) => {
    if(!schema){
        throw new Error(`Schema is undefined`);
    }
    if(!schema.fields){
        throw new Error(`Schema fields are undefined`);
    }

    return true
}

const isSchameOwnsField = (schema) => (field) => {
    return objectToArray(schema.fields)
        .filter(propVal('field'))
        .includes(field)
}

const hasAllPKFields = (schema) => (data) => {
    const primaryKeys = [...schema.primaryKey.partitionKeys, ...schema.primaryKey.orderingKeys];
    return primaryKeys.every((key) => data[key] !== undefined);
}

const checkFieldOverSchema = (schema, checkFor) => (property, number) => {
    if (property === undefined) {
        throw new Error(`Field of number ${number+1} is undefined, see ${checkFor}`);
    }

    if(!isSchameOwnsField(schema)(property)){
        throw new Error(`Field '${JSON.stringify(property)}' is not in schema, see ${checkFor}`);
    }

    return property;
    
}

const removeFieldsNotInScheme = (schema) => (data) => {
    const newData = deepClone(data);
    for(const key in newData){
        if(!schema.fields[key]){
            delete newData[key];
        }
    }
    return newData;
}

module.exports = {
    isSchemaValid,
    isSchameOwnsField,
    hasAllPKFields,
    checkFieldOverSchema,
    removeFieldsNotInScheme
}