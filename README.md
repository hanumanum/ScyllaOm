# ScyllaOm
ScyllaOm is a simple OM for ScyllaDB (& Apache Cassandra). It is a simple wrapper around the [DataStax Node.js driver]

## Instalation
```
npm install git+ssh@github.com:hanumanum/ScyllaOm.git
```

## Referance
for referance see examples
[ScyllaOm](https://github.com/hanumanum/ScyllaOm/tree/main/examples)

## Future Plans for Enhancing QueryBuilder

### Performance Optimization
- [ ] **Implement Map-Reduce Strategy:** Integrate a Map-Reduce strategy to enhance the performance and scalability of data processing within QueryBuilder.

### Argument Validation
- [ ] **Validate `whereIn()` Arguments:** Ensure the incoming arguments for `whereIn()` are of proper types to maintain data integrity and prevent errors.

### Query Flexibility
- [ ] **Expand Selection Methods:** Introduce additional selection methods to provide more flexibility in querying data:
  - [ ] `whereNotIn()`
  - [ ] `whereBetween()`
  - [ ] `whereNotBetween()`
  - [ ] `whereNull()`
  - [ ] `whereNotNull()`
  - [ ] ...
  
### Advanced Features
- [ ] **Incorporate Grouping, Aggregation, and Ordering:** Enhance the QueryBuilder with capabilities for data grouping, aggregation, and ordering to support complex queries and data analysis.