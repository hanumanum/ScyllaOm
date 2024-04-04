const { ScyllaOmQueryBuilder, ScyllaOM } = require('../src/');
const Schemas = require('./schemas/index.js');
const scyllaConfig = require('./00.scylla.config.js');

const main = async () => {
    const RRFields = Schemas.UsersExample.fields;
    const query = await ScyllaOmQueryBuilder(scyllaConfig)

    const result = await query
        .setSchema(Schemas.UsersExample)
        .select(RRFields.name
            , RRFields.category_id
            , RRFields.salary
        )
        .whereIn(RRFields.user_id, [46073, 89864, 23958, 48024, 88647, 13946, 79369, 25453, 44894, 67647, 89997])
        .whereIn(RRFields.name, ['bulk-user25453',
            'bulk-user44894',
            'bulk-user46073',
            'bulk-user48024',
            'bulk-user67647',
            'bulk-user79369'])
        .whereIn(RRFields.salary, [3000, 4000, 7000, 9000])
        .whereIn(RRFields.birth_year, [1993, 1994, 1997])
        .printQuery()
        .run()

    console.table(result)
}

main()



