const { flatArrayWithObjName, propVal } = require("./FP");

//TODO: add other types
const simpleTypes = [
    'BIGINT'
    , 'INT'
    , 'TEXT'
    , 'TIMESTAMP',
    , 'BOOLEAN',
    , 'DOUBLE'
    , 'UUID'
]

const collectionTypes = [
    'LIST<_T1_>'
    , 'MAP<_T1_,_T2_>'
]

const isDataTypeSupported = (field_type) => {
    const type = field_type
        .replace(/\s/g, "")
        .trim()
        .toUpperCase();

    for (const simpleType of simpleTypes) {
        if (type === simpleType || type === `FROZEN<${simpleType}>`) {
            return true;
        }
    }

    for (const collectionType of collectionTypes) {
        for (const sympleType of simpleTypes) {
            const composed = collectionType.replace('_T1_', sympleType)
            if (composed === type || type === `FROZEN<${composed}>`) {
                return true;
            }
        }
    }

    for (const collectionType of collectionTypes) {
        for (const sympleType1 of simpleTypes) {
            for (const sympleType2 of simpleTypes) {
                const composed = collectionType.replace('_T1_', sympleType1).replace('_T2_', sympleType2)
                if (composed === type || type === `FROZEN<${composed}>`) {
                    return true;
                }
            }
        }
    }

    return false;
}

const getSchemaRules = (schema) => [
    //TODO: include table name in the error message
    [schema !== undefined, 'schema is undefined'],
    [schema.fields !== undefined, 'schema.fields is undefined'],
    [schema.tableName !== undefined, 'schema.tableName is undefined'],
    [typeof schema.tableName === 'string', 'schema.tableName should be a string'],
    [schema.primaryKey !== undefined, 'schema.primaryKey is undefined'],

    [schema.primaryKey.partitionKeys !== undefined, 'schema.primaryKey.partitionKeys is undefined'],
    [Array.isArray(schema.primaryKey.partitionKeys), 'schema.primaryKey.partitionKeys should be an array'],
    [schema.primaryKey.partitionKeys.length > 0, 'schema.primaryKey.partitionKeys should have at least one value'],
    [schema.primaryKey.partitionKeys.every((val) => typeof val === 'string'), 'schema.primaryKey.partitionKeys should be an array of strings'],

    [schema.primaryKey.orderingKeys !== undefined, 'schema.primaryKey.orderingKeys is undefined'],
    [Array.isArray(schema.primaryKey.orderingKeys), 'schema.primaryKey.orderingKeys should be an array'],
    [schema.primaryKey.orderingKeys.length > 0, 'schema.primaryKey.orderingKeys should have at least one value'],
    [schema.primaryKey.orderingKeys.every((val) => typeof val === 'string'), 'schema.primaryKey.orderingKeys should be an array of strings'],

    [schema.primaryKey.orderingKeyOrders !== undefined, 'schema.primaryKey.orderingKeyOrders is undefined'],
    [Array.isArray(schema.primaryKey.orderingKeyOrders), 'schema.primaryKey.orderingKeyOrders should be an array'],
    [schema.primaryKey.orderingKeyOrders.length > 0, 'schema.primaryKey.orderingKeyOrders should have at least one value'],
    [schema.primaryKey.orderingKeyOrders.every((val) => typeof val === 'string'), 'schema.primaryKey.orderingKeyOrders should be an array of strings'],
    [schema.primaryKey.orderingKeyOrders.every((val) => val.toUpperCase() === 'ASC' || val.toUpperCase() === 'DESC'), 'schema.primaryKey.orderingKeyOrders only accepts "ASC" or "DESC" as values'],

    [schema.primaryKey.orderingKeyOrders.length === schema.primaryKey.orderingKeys.length, 'schema.primaryKey.orderingKeyOrders should have the same length as schema.primaryKey.orderingKeys']
]


const getFieldsRules = (schema) => {
    const fields = flatArrayWithObjName(schema.fields);
    const orderingKeyCheck = schema.primaryKey.orderingKeys.filter((key) => !fields.map(propVal('field')).includes(key));
    const partitionKeyCheck = schema.primaryKey.partitionKeys.filter((key) => !fields.map(propVal('field')).includes(key));
    const filedHaveTypeProp = fields.filter((field) => field.type === undefined);
    const filedHaveFieldProp = fields.filter((field) => field.field === undefined);
    const unSupportedDataTypes = fields.filter((field) => !isDataTypeSupported(field.type))

    //TODO: make error reporting more infrmative
    return [
        [partitionKeyCheck.length <= 0, `cannot create partition keys, for non defined columns: ${partitionKeyCheck}`],
        [orderingKeyCheck.length <= 0, `cannot create ordering keys, for non defined columns: ${orderingKeyCheck}`],
        [filedHaveFieldProp.length <= 0, `fieled(s) ${filedHaveFieldProp.map(propVal('propName'))} shuld have 'field' property`],
        [filedHaveTypeProp.length <= 0, `fieled(s) ${filedHaveTypeProp.map(propVal('propName'))} shuld have 'type' property`],
        [unSupportedDataTypes.length <= 0, 'unsupported data type(s) of fields: ' + unSupportedDataTypes.map(propVal('propName')).join(', ')],
    ];
};

const getRules = (schema) => {
    return [
        ...getSchemaRules(schema),
        ...getFieldsRules(schema)
    ]
}


module.exports = {
    isDataTypeSupported,
    getSchemaRules,
    getFieldsRules,
    getRules
}