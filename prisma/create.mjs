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
   
   
   await execute(`create database worktimemanagement`, client);
   console.log(`\x1b[32mDatabase successful created!\x1b[0m`);
}

await main();