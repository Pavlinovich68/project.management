import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";
import divisions from "./data/divisions";

// TODO Seed
async function main() {
   const upsertDivision = async (model: any, parentId: number | null) => {
      const result = await prisma.division.upsert({
         where: {name: model.name},
         update: {
            parent_id: parentId
         },
         create: {
               name: model.name,
               parent_id: parentId
         }
      });
      if (model.childrens && model.childrens.length > 0){
         for (const item of model.childrens){
            await upsertDivision(item, result.id);
         }
      }
      return result;
   }

   await upsertDivision(divisions, null).finally(() => console.log(`\x1b[32mDivisions seeded\x1b[0m`));

   const division = await prisma.division.findUnique({
      where: {
         name: 'Отдел автоматизации процессов и веб-технологий'
      }
   });

   if (division) {
      let hashPassword = await bcrypt.hashSync("Administrator1!", 8);

      await prisma.users.upsert({
         where: {email: 'administrator@localhost'},
         update: {
            name: 'Администратор системы',
            roles: {"admin": "Администратор системы"}
         },
         create: {
               email: 'administrator@localhost',
               name: 'Администратор системы',
               begin_date: new Date(),
               password: hashPassword,
               division_id: division.id,
               roles: {"admin": "Администратор системы"}
         }
      }).finally(() => console.log(`\x1b[32mUser "Администратор системы" created\x1b[0m`));

      hashPassword = await bcrypt.hashSync("Read_only1!", 8);

      await prisma.users.upsert({
         where: {email: 'read_only@localhost'},
         update: {
            name: "Только чтение",
            roles: {"read_only": "Только чтение"}
         },
         create: {
               email: 'read_only@localhost',
               name: "Только чтение",
               begin_date: new Date(),
               password: hashPassword,
               division_id: division.id,
               roles: {"read_only": "Только чтение"}
         }
      }).finally(() => console.log(`\x1b[32mUser "Только чтение" created\x1b[0m`));

   } else {
      throw new Error("Не удалось найти отдел автоматизации процессов и веб-технологий!");
   }   
}

main().then(async () => {
   await prisma.$disconnect();
})
.catch(async (e) => {
   console.log(e);
   await prisma.$disconnect();
   process.exit(1);
})