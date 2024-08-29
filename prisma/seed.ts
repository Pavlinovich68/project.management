import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";
import divisions from "./data/divisions";
import projects from "./data/projects.json";

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

      const profiles = ["Администратор системы",
                        "Савельев Павел",   
                        "Гажа Константин Владимирович",
                        "Гореньков Аркадий Юрьевич",
                        "Яхин Никита Артемович",
                        "Зелениченко Арсений Алексеевич",
                        "Кащеев Станислав Евгеньевич",
                        "Максимова Мария Станиславовна",
                        "Малясов Александр Евгеньевич",
                        "Мезенцев Алексей Юрьевич",
                        "Мезенцев Игорь Юрьевич",
                        "Джанабаева Гульзат Рустамовна",
                        "Павлов Сергей Павлинович",
                        "Потапов Дмитрий Иванович",
                        "Прокопенко Данил Евгеньевич",
                        "Кирков Алексей Михайлович",
                        "Окунев Александр Денисович"];
      let index = 1
      for (const profile of profiles){
         const is_boss = profile === "Павлов Сергей Павлинович";
         const email = `administrator${index}@localhost`;
         const user = await prisma.users.upsert({
            where: {email: email},
            update: {
               name: profile,
               begin_date: new Date(),
               division_id: division.id,
            },
            create: {
                  email: email,
                  name: profile,
                  begin_date: new Date(),
                  password: hashPassword,
                  division_id: division.id,
                  roles: {"admin": "Администратор системы"}
            }
         }).finally(() => console.log(`\x1b[32mUser \"${profile}\" created\x1b[0m`));
         
         index++;
         
         await prisma.profile.upsert({
            where: {user_id: user.id},
            update: {
               stack: 2,
               is_boss: is_boss
            },
            create: {
                  user_id: user.id,
                  stack: 2,
                  is_boss: is_boss
            }

         }).finally(() => console.log(`\x1b[32mProfile for user \"${profile}\" created\x1b[0m`));
      }      

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

   const seedProjects = async () => {
      try {
         await prisma.$queryRaw`delete from project`;

         const _division = await prisma.division.findFirst({where: {name: "Отдел автоматизации процессов и веб-технологий"}});

         if (!division) {
            throw new Error('Не удалось найти подразделение');
         }
      
         const _count = projects.length;
         let _index = 0;
         const _date = new Date(2024, 0, 1);
         while (_index < _count) {
            let _node = projects[_index];
            await prisma.project.create({
               data: {
                  code: _node.code,
                  name: _node.name,
                  begin_date: _date,
                  division_id: _division ? _division.id : null
               }
            });
            _index++;
         }
         return _index;  
      } catch (error) {
         throw error;
      }      
   }

   await seedProjects().finally(() => console.log(`\x1b[32mProjects seeded\x1b[0m`))
}

main().then(async () => {
   await prisma.$disconnect();
})
.catch(async (e) => {
   console.log(e);
   await prisma.$disconnect();
   process.exit(1);
})