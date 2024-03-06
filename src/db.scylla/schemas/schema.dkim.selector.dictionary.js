const DkimSelectorDicitonary = {
    tableName: "dkim_selectors",
    fields: {
        account_id: {
            type: "BIGINT",
            field: "account_id"
        },
        domain_id: {
            type: "BIGINT",
            field: "domain_id"
        },
        dkim_selector:{
            type: "TEXT",
            field: "dkim_selector",
        },
    },
    primaryKey: {
        partitionKeys: ['account_id'],
        orderingKeys: ['domain_id','dkim_selector'],
    }
}

module.exports = {
    DkimSelectorDicitonary
}