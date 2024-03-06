const DkimDomainDicitonary = {
    tableName: "dkim_domains",
    fields: {
        account_id: {
            type: "BIGINT",
            field: "account_id"
        },
        domain_id: {
            type: "BIGINT",
            field: "domain_id"
        },
        dkim_domain:{
            type: "TEXT",
            field: "dkim_domain",
        },
    },
    primaryKey: {
        partitionKeys: ['account_id'],
        orderingKeys: ['domain_id','dkim_domain'],
    }
}

module.exports = {
    DkimDomainDicitonary
}