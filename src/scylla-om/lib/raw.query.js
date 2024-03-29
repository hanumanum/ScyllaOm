const { chunkifyArray } = require("./FP");

const rawQuery = (client) => async (query, params, consistency) => {
    try {
        const options = {
            prepare: true,
            consistency: consistency
        }

        return await client.execute(query, params, options)
    }
    catch (err) {
        throw err;
    }
}

const bulkExecute = (client) => async (queriesWithParams, chunkSize, consistency) => {
    let data = []
    try {
        //TODO: shuld we use this method ?
        //cassandra.concurrent.executeConcurrent()
        const chunks = chunkifyArray(queriesWithParams, chunkSize)
        const _rawQuery = rawQuery(client);

        for (let chunk of chunks) {
            const chunksData = await Promise.all(chunk.map(({ query, params }) => _rawQuery(query, params, consistency)))
            data = [...data, ...chunksData]
        }

        return data
    }
    catch (err) {
        throw err
    }
}

const streamQuery = (client) => async (query, params, consistency, doOnRow, doOnEnd, doOnError) => {
    const options = {
        prepare: true,
        consistency: consistency
    }

    let row;
    return new Promise((resolve, reject) => {
        const stream = client.stream(query, params, options)

        stream.on('readable', async function () {
            while (row = this.read()) {
                await doOnRow(row)
            }
        })

        stream.on('end', async () => {
            await doOnEnd()
            return resolve()
        })

        stream.on('error', async (err) => {
            await doOnError(err)
            return reject({ lastRow: row, err })
        })
    })
}


module.exports = {
    rawQuery,
    bulkExecute,
    streamQuery
}