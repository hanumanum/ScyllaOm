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
            type: "FROZEN<LIST<TEXT>>",
            field: "tags",
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
        orderingKeyOrders: ['ASC']
    }
}

module.exports = PostsExample