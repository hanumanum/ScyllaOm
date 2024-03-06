const { migrateRUAtoScyllaByAccountsAndID, rollbackByIdRange } = require("./migrators/migrate.rua.reports");
/*
SELECT MIN(id), MAX(id), COUNT(id), MIN(date_begin), MAX(date_end)
from rua_report_records
WHERE account_id in (4579, 18150, 8011)

MIN(id) 170394093,
MAX(id) 976989822,
COUNT(id) 21 406 223
MIN(date_begin) 1664001157
MAX(date_begin) 1708248122
*/

const main = async () => {
  //await rollbackByIdRange(834394093,1951594093)
  //return

  const accountsToImport = [4579, 18150, 8011]
  //const accountsToImport = [24622, 2593, 21465, 7549, 3064, 13857, 18249, 2279, 4912, 6398, 4579, 18150, 8011, 6368, 16785, 6960, 3206]

  let startID = 170394093 //623594093 //551_394_093 //472_794_093 //170_394_093//   // lastProcessedId + 1 //170_394_093
  const end = startID + 1000 //463_894_093
  const minDate = 1_664_001_157
  const maxDate = 1_708_248_122
  const step = 100_000

  console.time("migrateRUAtoScyllaByAccounts");
  while (startID < end) {
    try {
      startID = await migrateRUAtoScyllaByAccountsAndID(startID, step, accountsToImport, minDate, maxDate);
      process.exit(0)
    }
    catch (e) {
      console.error(e)
      process.exit(0)
    }
  }
  console.timeEnd("migrateRUAtoScyllaByAccounts");
  process.exit(0);

}

main()