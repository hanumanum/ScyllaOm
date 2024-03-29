const cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;

const scyllaConfig = {
    contactPoints: ['192.168.0.143', '192.168.0.144', '192.168.0.146'],
    authProvider: new cassandra.auth.PlainTextAuthProvider(
        undefined,
        undefined
    ),
    localDataCenter: 'datacenter1',
    socketOptions:{
        readTimeout: 48000,
    },
    pooling: {
        coreConnectionsPerHost: {
            [distance.local]: 4,
            [distance.remote]: 4,
        },
        maxRequestsPerConnection: 32768
    },
    keyspace: 'powerdmarc_scylla_test',
}

module.exports = scyllaConfig