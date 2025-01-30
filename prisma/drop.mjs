import pkg from "pg";

const main = async () => {

   const client = new pkg.Client({
      host: 'localhost',
      user: 'postgres',
      database: 'postgres',
      password: '123456qwerty',
      port: 5432,
   });

   const execute = async (query, cl) => {
      try {
         await cl.connect();     // gets connection
         await cl.query(query);  // sends queries
         return true;
      } catch (error) {
         console.error(error.stack);
         return false;
      } finally {
         await cl.end();         // closes connection
      }
   };


   await execute(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'worktimemanagement'`, client);
   console.log(`\x1b[32mSessions successful cleaning!\x1b[0m`);

   const client1 = new pkg.Client({
      host: 'localhost',
      user: 'postgres',
      database: 'postgres',
      password: '123456qwerty',
      port: 5432,
   });

   const result = await execute('DROP DATABASE worktimemanagement', client1);

   if (result) {
      console.log(`\x1b[32mDatabase successful dropped!\x1b[0m`);
   }
}

await main();