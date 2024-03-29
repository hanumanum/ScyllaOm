const SchemaExample = {
    tableName: "example_table",
    fields: {
        account_id: {
            type: "BIGINT",
            field: "account_id"
        },
        field_with_list: {
            type: "LIST<TEXT>",
            field: "field_with_list",
            frozen: true
        },
        category_id:{
            type: "INT",
            field: "category_id",
        },
        volume: {
            type: "INT",
            field: "volume",
            aggregatable: true
        },
        date_begin: {
            type: "INT",
            field: "date_begin"
        },
        created_at: {
            type: "TIMESTAMP",
            field: "created_at"
        },
        updated_at: {
            type: "TIMESTAMP",
            field: "updated_at"
        }
    },
    primaryKey: {
        partitionKeys: ['account_id'],
        orderingKeys: ['field_with_list','category_id'],
        orderingKeyOrders: ['ASC', 'DESC'] //TODO: currenty not implemented, think about this
    }
}

module.exports = SchemaExample