/**
 * Checks if the given schema is valid.
 * TODO: Implement the actual validation logic.
 *
 * @param {Object} schema The schema object to validate.
 * @returns {boolean} Always returns true. Implement actual logic for validation.
 */
const isSchemaValid = (schema) => {
    return true
}

/**
 * Compares two objects for equality by their JSON string representation.
 *
 * @param {Object} obj1 The first object to compare.
 * @param {Object} obj2 The second object to compare.
 * @returns {boolean} True if the objects are the same, false otherwise.
 */
const compareObjects = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/**
 * Creates a deep clone of an object or array, handling circular references.
 *
 * @param {Object|Array} obj The object or array to clone.
 * @param {WeakMap} [hash=new WeakMap()] A hash map for handling circular references.
 * @returns {Object|Array} The deep-cloned object or array.
 */
const deepClone = (obj, hash = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj); // Handles circular references
    let result = Array.isArray(obj) ? [] : {};
    hash.set(obj, result);
    for (let key of Object.keys(obj)) {
        result[key] = deepClone(obj[key], hash);
    }
    return result;
}

/**
 * Recursively checks if two objects or arrays are equal.
 *
 * @param {Object|Array} obj1 The first object or array to compare.
 * @param {Object|Array} obj2 The second object or array to compare.
 * @returns {boolean} True if objects or arrays are deeply equal, false otherwise.
 */
const isDeepEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}

/**
 * Generates a random string of a specified length.
 *
 * @param {number} number The length of the random string to generate.
 * @returns {string} The generated random string.
 */
const randomStr = (number) => {
    return Math.random().toString(36).substring(2, number + 2);
}

/**
 * Executes a function and logs the time it takes to execute with a custom title.
 *
 * @param {Function} fn The asynchronous function to execute.
 * @param {string} title The title for the log entry.
 */
const withTimeLog = async (fn, title) => {
    const _title = `${Date.now()} ${randomStr(5)}: ${title}`
    console.time(_title);
    await fn();
    console.timeEnd(_title);
}

/**
 * Splits an array into chunks of a specified size.
 *
 * @param {Array} arr The array to chunk.
 * @param {number} size The size of each chunk.
 * @returns {Array} An array of chunks.
 */
const chunkify = (arr, size) => {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) {
            acc.push(arr.slice(i, i + size))
        }
        return acc
    }, [])
}

/**
 * Checks if the given value is a plain object (i.e., not an array, date, null, etc.).
 *
 * @param {any} obj The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
const isPlainObject = (obj) => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj) && !(obj instanceof Date);
}


module.exports = {
    isSchemaValid,
    deepClone,
    compareObjects,
    isDeepEqual,
    withTimeLog,
    chunkify,
    isPlainObject
}