const { isPlainObject, deepClone, arrayToKey } = require("./FP");
const { getPrimaryKeys } = require("./schema");

const instantate = (schema) => (data) => {
  if (!isPlainObject(data)) {
    console.log(data)
    throw new Error(`${schema.tableName} Cannot instantate, argument is not an object`);
  }

  const primaryKeys = getPrimaryKeys(schema)
  const findMissingKeys = (data) => primaryKeys.filter((key) => data[key] === undefined || data[key] === null)
  const keysFromSchema = (key) => (key in schema.fields)

  const calcPrimaryKeyId = (data) => {
    return primaryKeys
      .reduce((acc, key) => {
        acc += '_' + key + '_' + arrayToKey(data[key])
        return acc
      }, '')
  }

  const addValues = (acc, key) => {
    acc[key] = {
      ...schema.fields[key],
      value: data[key]
    }
    return acc
  }

  const missingFields = findMissingKeys(data)
  if (missingFields.length > 0) {
    const errMessage = `Cannot create instance. ${schema.tableName}\n All fields in primary key required and should have values, missing keys are: ${missingFields.join("\n,")}` 
    throw new Error(errMessage)
  }

  const fields = Object
    .keys(data)
    .filter(keysFromSchema)
    .reduce(addValues, {})

  const instance = deepClone(schema)
  instance.fields = fields
  instance.primaryKeyId = calcPrimaryKeyId(data)

  return instance
}


const mergeInstancesSums = (instance1, instance2) => {
  if (!instance1 && !instance2) return null
  if (!instance1) return instance2
  if (!instance2) return instance1

  for (const key in instance1.fields) {
    if (instance1.fields[key].aggregatable) {
      instance1.fields[key].value += instance2.fields[key].value
    }
  }
  return instance1
}

const combineInstancesSumByPK = (instances) => {
  const combinedInstances = []

  while (inst = instances.shift()) {
    let index = instances.findIndex((instToFind) => instToFind.primaryKeyId === inst.primaryKeyId)

    while (index > -1) {
      const toMerge = instances[index]
      inst = mergeInstancesSums(inst, toMerge)
      //This is for rollback issues
      inst.fields.rua_record_id.value = Math.max(inst.fields.rua_record_id.value, toMerge.fields.rua_record_id.value)

      instances.splice(index, 1)
      index = instances.findIndex((instToFind) => instToFind.primaryKeyId === inst.primaryKeyId)
    }
    combinedInstances.push(inst)
  }

  return combinedInstances
}

const findInstanceIn = (instances, instance) => {
  return instances.find((inst) => inst.primaryKeyId === instance.primaryKeyId) || null
}

module.exports = {
  instantate,
  combineInstancesSumByPK,
  mergeInstancesSums,
  findInstanceIn
}