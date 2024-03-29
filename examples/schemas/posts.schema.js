const PostsExample = {
    tableName: "posts",
    fields: {
        user_id:{
            type: "BIGINT",
            field: "user_id"
        },
        post_id: {
            type: "BIGINT",
            field: "post_id"
        },
        title: {
            type: "TEXT",
            field: "title"
        },
        content: {
            type: "TEXT",
            field: "content"
        },
        tags: {
            type: "LIST<TEXT>",
            field: "tags",
            frozen: true
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
        }
    },
    primaryKey: {
        partitionKeys: ['user_id'],
        orderingKeys: ['post_id'],
        orderingKeyOrders: ['ASC', 'DESC'] //TODO: currenty not implemented, think about this
    }
}

module.exports = PostsExample