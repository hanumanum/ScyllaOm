/**
 * Extracts a specific field's value from a row object.
 * @param {string} field_name The name of the field to extract.
 * @returns {Function} A function that takes a row object and returns the value of the specified field.
 */
const propVal = (field_name) => (row) => row[field_name];

/**
 * Negates a function.
 * 
 */
const not = (fn) => (val) => !fn(val)

/**
 * 
 * @param  {...any} fns 
 * @returns function
 */
const fnCompose = (...fns) => (val) => fns.reduce((acc, fn) => fn(acc), val);


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
const chunkifyArray = (arr, size) => {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) {
            acc.push(arr.slice(i, i + size))
        }
        return acc
    }, [])
}


/**
 * @param {number} start 
 * @param {number} end
 * @returns {Array} array of integers 
 */
const getIntRange = (start, end) => {
    const range = [];
    for (let i = start; i < end; i++) {
        range.push(i)
    }
    return range;
}

/** 
 * 
 * @param {number} start
 * @param {number} end
 * @param {number} chankSize
 * @returns {Array} array of objects with rangeStart and rangeEnd properties
 */
const chunkifyRange = (start, end, chankSize) => {
    const chanks = [];
    for (let i = start; i < end; i += chankSize) {
        chanks.push({
            rangeStart: i,
            rangeEnd: Math.min(i + chankSize, end)
        });
    }
    return chanks;
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

const objectToArray = (obj) => Object.keys(obj).map(key => obj[key])

const arrayToKey = (value) => {
    if (Array.isArray(value)) {
        const strArr = value.sort().join('::')
        if (strArr !== '') {
            return strArr;
        }
        else {
            return value
                .map((_) => '_')
                .join('::')
        }
    }
    return value
}


module.exports = {
    objectToArray,
    deepClone,
    withTimeLog,
    chunkifyArray,
    chunkifyRange,
    isPlainObject,
    propVal,
    not,
    getIntRange,
    fnCompose,
    arrayToKey
}