const { ScyllaOmQueryBuilder } = require('../src/');
const Schemas = require('./schemas/index.js');

const RRFields = Schemas.UsersExample.fields;
const query = ScyllaOmQueryBuilder()
    .setSchema(Schemas.UsersExample)
    .select(RRFields.name
        , RRFields.category_id
        , RRFields.salary
    )
    .whereIn(RRFields.user_id, [46073,89864,23958,48024,88647,13946,79369,25453,44894,67647,89997])
    .whereIn(RRFields.name, ['bulk-user57379', 'bulk-user13946', 'bulk-user53916'])
    .allowFiltering()
    .printQuery()
