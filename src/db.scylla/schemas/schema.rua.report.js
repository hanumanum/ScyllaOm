const RuaReports = {
    tableName: "rua_reports",
    fields: {
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
        rua_record_id: {
            type: "BIGINT",
            field: "rua_record_id"
        },
        report_sender_id: {
            type: "INT",
            field: "report_sender_id"
        },
        receivers: {
            type: "LIST<TEXT>",
            field: "receivers",
        },
        message_id: {
            type: "TEXT",
            field: "message_id"
        },

        receiver_given_email_id: {
            type: "TEXT",
            field: "receiver_given_email_id"
        },
        rua_report_id: {
            type: "TEXT",
            field: "rua_report_id"
        },
        email: {
            type: "TEXT",
            field: "email"
        },
        for_domain: {
            type: "TEXT",
            field: "for_domain"
        },
        org_name: {
            type: "TEXT",
            field: "org_name"
        },
        extra_contact_info: {
            type: "TEXT",
            field: "extra_contact_info"
        },
        policy_adkim: {
            type: "TEXT",
            field: "policy_adkim"
        },
        policy_aspf: {
            type: "TEXT",
            field: "policy_aspf"
        },
        policy_p: {
            type: "TEXT",
            field: "policy_p"
        },
        policy_sp: {
            type: "TEXT",
            field: "policy_sp"
        },
        policy_pct: {
            type: "INT",
            field: "policy_pct"
        },
        policy_fo: {
            type: "TEXT",
            field: "policy_fo"
        },
        error: {
            type: "TEXT",
            field: "error"
        },
        file_hash: {
            type: "TEXT",
            field: "file_hash"
        },
        policy_eval_type: {
            type: "TEXT",
            field: "policy_eval_type"
        },
        policy_eval_comment: {
            type: "TEXT",
            field: "policy_eval_comment"
        },
        envelope_from: {
            type: "TEXT",
            field: "envelope_from"
        },
        spf_scope: {
            type: "TEXT",
            field: "spf_scope"
        },
        spf_result: {
            type: "TEXT",
            field: "spf_result"
        },
        dkim_result_passed: {
            type: "BOOLEAN",
            field: "dkim_result_passed"
        },
        dkim_result_result: {
            type: "LIST<TEXT>",
            field: "dkim_result_result",
            frozen: true
        },
        volume: {
            type: "INT",
            field: "volume",
            aggregatable: true
        },
        count_dmarc_pass: {
            type: "INT",
            field: "count_dmarc_pass",
            aggregatable: true
        },
        count_dmarc_pass_spf_aligned: {
            type: "INT",
            field: "count_dmarc_pass_spf_aligned",
            aggregatable: true
        },
        count_dmarc_pass_dkim_aligned: {
            type: "INT",
            field: "count_dmarc_pass_dkim_aligned",
            aggregatable: true
        },
        count_dmarc_pass_fully_aligned: {
            type: "INT",
            field: "count_dmarc_pass_fully_aligned",
            aggregatable: true
        },
        count_dmarc_pass_spf_not_aligned: {
            type: "INT",
            field: "count_dmarc_pass_spf_not_aligned",
            aggregatable: true
        },
        count_dmarc_pass_dkim_not_aligned: {
            type: "INT",
            field: "count_dmarc_pass_dkim_not_aligned",
            aggregatable: true
        },
        count_dmarc_pass_fully_not_aligned: {
            type: "INT",
            field: "count_dmarc_pass_fully_not_aligned",
            aggregatable: true
        },
        count_dmarc_pass_spf_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_pass_spf_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_pass_dkim_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_pass_dkim_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_pass_fully_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_pass_fully_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_fail_spf_not_aligned: {
            type: "INT",
            field: "count_dmarc_fail_spf_not_aligned",
            aggregatable: true
        },
        count_dmarc_pass_dkim_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_pass_dkim_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_pass_fully_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_pass_fully_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_fail_spf_not_aligned: {
            type: "INT",
            field: "count_dmarc_fail_spf_not_aligned",
            aggregatable: true
        },
        count_dmarc_fail_dkim_not_aligned: {
            type: "INT",
            field: "count_dmarc_fail_dkim_not_aligned",
            aggregatable: true
        },
        count_dmarc_fail_fully_not_aligned: {
            type: "INT",
            field: "count_dmarc_fail_fully_not_aligned",
            aggregatable: true
        },
        count_dmarc_fail_spf_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_fail_spf_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_fail_dkim_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_fail_dkim_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_fail_fully_not_aligned_forwarded: {
            type: "INT",
            field: "count_dmarc_fail_fully_not_aligned_forwarded",
            aggregatable: true
        },
        count_dmarc_fail: {
            type: "INT",
            field: "count_dmarc_fail",
            aggregatable: true
        },
        count_dmarc_fail_policy_local: {
            type: "INT",
            field: "count_dmarc_fail_policy_local",
            aggregatable: true
        },
        count_dmarc_fail_not_forwarded: {
            type: "INT",
            field: "count_dmarc_fail_not_forwarded",
            aggregatable: true
        },
        count_dmarc_fail_forwarded: {
            type: "INT",
            field: "count_dmarc_fail_forwarded",
            aggregatable: true
        },
        count_dmarc_none: {
            type: "INT",
            field: "count_dmarc_none",
            aggregatable: true
        },
        count_dmarc_quarantine: {
            type: "INT",
            field: "count_dmarc_quarantine",
            aggregatable: true
        },
        count_dmarc_reject: {
            type: "INT",
            field: "count_dmarc_reject",
            aggregatable: true
        },
        count_spf_none: {
            type: "INT",
            field: "count_spf_none",
            aggregatable: true
        },
        count_spf_neutral: {
            type: "INT",
            field: "count_spf_neutral",
            aggregatable: true
        },
        count_spf_fail: {
            type: "INT",
            field: "count_spf_fail",
            aggregatable: true
        },
        count_dkim_none: {
            type: "INT",
            field: "count_dkim_none",
            aggregatable: true
        },
        count_dkim_neutral: {
            type: "INT",
            field: "count_dkim_neutral",
            aggregatable: true
        },
        count_dkim_policy: {
            type: "INT",
            field: "count_dkim_policy",
            aggregatable: true
        },
        count_dkim_fail: {
            type: "INT",
            field: "count_dkim_fail",
            aggregatable: true
        },
        count_eval_forwarded: {
            type: "INT",
            field: "count_eval_forwarded",
            aggregatable: true
        },
        count_eval_local_policy: {
            type: "INT",
            field: "count_eval_local_policy",
            aggregatable: true
        },
        count_eval_other: {
            type: "INT",
            field: "count_eval_other",
            aggregatable: true
        },
        date_end: {
            type: "INT",
            field: "date_end"
        },
        date_sent: {
            type: "INT",
            field: "date_sent"
        },
        date_processed: {
            type: "INT",
            field: "date_processed"
        },
        is_autoforwarded: {
            type: "BOOLEAN",
            field: "is_autoforwarded"
        },
        ip_info_id: {
            type: "BIGINT",
            field: "ip_info_id"
        },
        address: {
            type: "INET",
            field: "address"
        },
        longitude: {
            type: "DOUBLE",
            field: "longitude"
        },
        latitude: {
            type: "DOUBLE",
            field: "latitude"
        },
        type: {
            type: "TEXT",
            field: "type"

        },
        continent_code: {
            type: "TEXT",
            field: "continent_code"

        },
        continent_name: {
            type: "TEXT",
            field: "continent_name"

        },
        country_code: {
            type: "TEXT",
            field: "country_code"
        },
        country_name: {
            type: "TEXT",
            field: "country_name"
        },
        region_code: {
            type: "TEXT",
            field: "region_code"
        },
        region_name: {
            type: "TEXT",
            field: "region_name"
        },
        city: {
            type: "TEXT",
            field: "city"
        },
        zip: {
            type: "TEXT",
            field: "zip"
        },
        source_domain: {
            type: "TEXT",
            field: "source_domain"
        },
        source_subdomain: {
            type: "TEXT",
            field: "source_subdomain"
        },
        source_full_domain: {
            type: "TEXT",
            field: "source_full_domain"
        },
        asn: {
            type: "TEXT",
            field: "asn"
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
        orderingKeys: ['date_begin',
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
    RuaReports
}