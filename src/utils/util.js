/**
 * Delays the execution of the next line in the code.
 * @param {number} time The time in milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified time has passed.
 */
const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Determines if two sets are equal.
 * @param {Set} setA The first set to compare.
 * @param {Set} setB The second set to compare.
 * @returns {boolean} True if the sets are equal, false otherwise.
 */
const areSetsEqual = (setA, setB) => {
  if (setA.size !== setB.size) {
    return false;
  }

  for (let a of setA) {
    if (!setB.has(a)) {
      return false;
    }
  }

  return true;
}

/**
 * Recursively freezes an object, making it immutable.
 * @param {Object} object The object to freeze.
 * @returns {Object} The frozen object.
 */
const deepFreeze = (object) => {
  const propNames = Object.getOwnPropertyNames(object);
  propNames.forEach(name => {
    const prop = object[name];

    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });

  return Object.freeze(object);
}

/**
 * Calculates the size of a JSON object in megabytes.
 * @param {Object} jsonObj The JSON object to calculate the size of.
 * @returns {number} The size of the JSON object in megabytes.
 */
const calcSizeOfObject = (jsonObj) => {
  let totalString = '';
  //TODO: refactor, remove global variable totalString 
  const extractValues = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractValues(obj[key]);
      } else {
        totalString += JSON.stringify(obj[key]);
      }
    }
  }

  extractValues(jsonObj);
  const sizeInBytes = new TextEncoder().encode(totalString).length;
  const sizeInMB = sizeInBytes / 1048576;
  return sizeInMB;
}

/**
 * Formats a number with separators.
 * @param {number} number The number to format.
 * @returns {string} The formatted number.
 */
const formatNumber = (number) => new Intl.NumberFormat('de-DE').format(number);

/**
 * Filters an array to contain only distinct elements.
 * @param {Array} arr The array to filter.
 * @returns {Array} An array containing only distinct elements.
 */
const distinct = (arr) => {
  return arr.filter((value, index, self) =>
    self.findIndex(v => JSON.stringify(v) === JSON.stringify(value)) === index
  );
}


/** 
 * Returns each day between the start and end date in UNIX format narrowed to start of the day in miliseconds for GMT.
 */
const daysInRange = (startDate, endDate) => {
  const days = [];
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    days.push(new Date(date).setUTCHours(0, 0, 0, 0)/1000);
  }
  return days;

}

module.exports = {
  delay,
  deepFreeze,
  areSetsEqual,
  calcSizeOfObject,
  formatNumber,
  distinct,
  daysInRange
};
