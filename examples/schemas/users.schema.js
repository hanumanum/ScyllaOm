const UsersExample = {
    tableName: "users",
    fields: {
        user_id: {
            type: "BIGINT",
            field: "user_id"
        },
        name: {
            type: "TEXT",
            field: "name"
        },
        title: {
            type: "TEXT",
            field: "title"
        },
        nick_names: {
            type: "FROZEN<LIST<TEXT>>",
            field: "nick_names",
        },
        birth_year: {
            type: "INT",
            field: "birth_year",
        },
        category_id:{
            type: "INT",
            field: "category_id",
        },
        created_at: {
            type: "TIMESTAMP",
            field: "created_at"
        },
        updated_at: {
            type: "TIMESTAMP",
            field: "updated_at"
        },
    },
    primaryKey: {
        partitionKeys: ['user_id'],
        orderingKeys: ['name','category_id','title'],
        orderingKeyOrders: ['ASC', 'DESC', 'asc']
    }
}

module.exports = UsersExample