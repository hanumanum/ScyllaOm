const { withDropTableENUM } = require("./db.scylla/lib/cql.utils");
const { reCreateTables } = require("./migrators/migrate.rua.reports");

const main = async () => {
  await reCreateTables(withDropTableENUM.withoutDrop);
  process.exit(0);
}

main()