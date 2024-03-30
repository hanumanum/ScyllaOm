const SchemaExample = {
    tableName: "example_table",
    fields: {
        account_id: {
            type: "BIGINT",
            field: "account_id"
        },
        field_with_list: {
            type: "FROZEN<LIST<TEXT>>",
            field: "field_with_list",
        },
        category_id: {
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
        orderingKeys: ['field_with_list', 'category_id'],
        orderingKeyOrders: ['ASC', 'DESC']
    },
    //Currently not implemented
    tableOptions: {
        bloom_filter_fp_chance: 0.01,
        caching: {
            keys: 'ALL',
            rows_per_partition: 'ALL'
        },
        comment: '',
        compaction: { class: 'SizeTieredCompactionStrategy' },
        compression: { sstable_compression: 'org.apache.cassandra.io.compress.LZ4Compressor' },
        crc_check_chance: 1,
        dclocal_read_repair_chance: 0,
        default_time_to_live: 0,
        gc_grace_seconds: 864000,
        max_index_interval: 2048,
        memtable_flush_period_in_ms: 0,
        min_index_interval: 128,
        read_repair_chance: 0,
        speculative_retry: '99.0PERCENTILE',
        paxos_grace_seconds: 864000,
        tombstone_gc: {
            mode: 'timeout',
            propagation_delay_in_seconds: '3600'
        }
    }
}

module.exports = SchemaExample