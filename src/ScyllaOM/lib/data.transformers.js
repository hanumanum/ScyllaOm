const cassandra = require('cassandra-driver');
const TimeUuid = cassandra.types.TimeUuid;

/**
 * Adds a TimeUuid to a row object under a specified column name.
 * @param {string} columnName The name of the column to add the TimeUuid to.
 * @returns {Function} A function that takes a row object and returns a new object with the TimeUuid added.
 */
const addTimeUUid = (columnName) => (row) => {
    return {
        [columnName]: TimeUuid.now(),
        ...row
    }
}

/**
 * Applies the addTimeUUid function to each row in an array of rows.
 * @param {string} columnName The name of the column to add the TimeUuid to for each row.
 * @returns {Function} A function that takes an array of row objects and returns a new array with TimeUuid added to each row.
 */
const addTimeUUidToArray = (columnName) => (rows) => rows.map(addTimeUUid(columnName));

/**
 * Transforms a specific field in a row object using a provided function.
 * @param {string} field_name The name of the field to transform.
 * @param {Function} fn The function to apply to the specified field.
 * @returns {Function} A function that takes a row object and returns a new object with the specified field transformed.
 */
const transformField = (field_name) => (fn) => (row) => {
    row[field_name] = fn(row[field_name]);
    return row;
}

/**
 * Extracts a specific field's value from a row object.
 * @param {string} field_name The name of the field to extract.
 * @returns {Function} A function that takes a row object and returns the value of the specified field.
 */
const extractField = (field_name) => (row) => row[field_name];

/**
 * Checks if a specific field in a value/object is not null.
 * @param {string} field The field to check in the value.
 * @returns {Function} A function that takes a value/object and returns true if the specified field is not null.
 */
const fieldNotNull = (field) => (val) => val[field] !== null

/**
 * Checks if a specific field in a value/object is not empty.
 * @param {string} field The field to check in the value.
 * @returns {Function} A function that takes a value/object and returns true if the specified field is not empty.
 */
const fieldNotEmpty = (field) => (val) => val[field] !== ''


module.exports = {
    addTimeUUidToArray,
    addTimeUUid,
    transformField,
    extractField,
    fieldNotNull,
    fieldNotEmpty
}