const RuaReportsImported = {
    tableName: "rua_reports_imported",
    fields: {
        rua_record_id: {
            type: "BIGINT",
            field: "rua_record_id"
        },
        account_id: {
            type: "BIGINT",
            field: "account_id"
        },
        date_begin: {
            type: "INT",
            field: "date_begin"
        },
        policy_eval_disposition: {
            type: "TEXT",
            field: "policy_eval_disposition"
        },
        policy_eval_dkim: {
            type: "TEXT",
            field: "policy_eval_dkim"
        },
        policy_eval_spf: {
            type: "TEXT",
            field: "policy_eval_spf"
        },
        domain_id: {
            type: "BIGINT",
            field: "domain_id"
        },
        header_from: {
            type: "TEXT",
            field: "header_from"
        },
        source_ip: {
            type: "TEXT",
            field: "source_ip"
        },
        sender: {
            type: "TEXT",
            field: "sender"
        },
        envelope_to: {
            type: "TEXT",
            field: "envelope_to"
        },
        spf_domain: {
            type: "TEXT",
            field: "spf_domain"
        },
        dkim_result_domain: {
            type: "LIST<TEXT>",
            field: "dkim_result_domain",
            frozen: true
        },
        dkim_result_selector: {
            type: "LIST<TEXT>",
            field: "dkim_result_selector",
            frozen: true
        },
        dkim_result_result: {
            type: "LIST<TEXT>",
            field: "dkim_result_result",
            frozen: true
        },
    },
    primaryKey: {
        partitionKeys: ['rua_record_id'],
        orderingKeys: [
            'account_id',
            'date_begin',
            'policy_eval_disposition',
            'policy_eval_dkim',
            'policy_eval_spf',
            'domain_id',
            'header_from',
            'source_ip',
            'sender',
            'envelope_to',
            'spf_domain',
            'dkim_result_domain',
            'dkim_result_result',
            'dkim_result_selector'
        ]
    }
}

module.exports = {
    RuaReportsImported
}