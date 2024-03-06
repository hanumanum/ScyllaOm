const cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;

//TODO: move to env
const scyllaConfig = {
    contactPoints: ['192.168.0.143', '192.168.0.144', '192.168.0.146'],
    authProvider: new cassandra.auth.PlainTextAuthProvider(
        undefined,
        undefined
    ),
    localDataCenter: 'datacenter1',
    pooling: {
        coreConnectionsPerHost: {
            [distance.local]: 4,
            [distance.remote]: 4,
        },
        maxRequestsPerConnection: 32768
    }
}

module.exports = scyllaConfig