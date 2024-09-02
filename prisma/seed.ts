import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";
import divisions from "./data/divisions";
import projects from "./data/projects.json";
import production_calendar from "./data/calendar.json";

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

      interface emp<T> { [index: string]: T }
      const profiles: emp<string> = {  
                                       "Савельев Павел":                   "Савельев",   
                                       "Гажа Константин Владимирович":     "Гажа",
                                       "Гореньков Аркадий Юрьевич":        "Гореньков",
                                       "Яхин Никита Артемович":            "Яхин",
                                       "Зелениченко Арсений Алексеевич":   "Зелениченко",
                                       "Кащеев Станислав Евгеньевич":      "Кащеев",
                                       "Максимова Мария Станиславовна":    "Максимова",
                                       "Малясов Александр Евгеньевич":     "Малясов",
                                       "Мезенцев Алексей Юрьевич":         "Мезенцев А.",
                                       "Мезенцев Игорь Юрьевич":           "Мезенцев И.",
                                       "Джанабаева Гульзат Рустамовна":    "Джанабаева",
                                       "Павлов Сергей Павлинович":         "Павлов",
                                       "Потапов Дмитрий Иванович":         "Потапов",
                                       "Прокопенко Данил Евгеньевич":      "Прокопенко",
                                       "Кирков Алексей Михайлович":        "Кирков",
                                       "Окунев Александр Денисович":       "Окунев"
                                    };
      let index = 1
      for (var key in profiles){
         const is_boss = profiles[key] === "Павлов";
         const email = `administrator${index}@localhost`;
         const user = await prisma.users.upsert({
            where: {email: email},
            update: {
               name: key,
               roles: is_boss ? {"master": "Начальник отдела", "developer": "Разработчик", "admin": "Администратор"} : {"developer": "Разработчик"},
               begin_date: new Date(),
               division_id: division.id,
            },
            create: {
                  email: email,
                  name: key,
                  begin_date: new Date(),
                  password: hashPassword,
                  division_id: division.id,
                  roles: is_boss ? {"master": "Начальник отдела", "developer": "Разработчик"} : {"developer": "Разработчик"}
            }
         }).finally(() => console.log(`\x1b[32mUser \"${key}\" created\x1b[0m`));
         
         index++;
         
         await prisma.profile.upsert({
            where: {user_id: user.id},
            update: {
               stack: 2,
               short_name: profiles[key],
               is_boss: is_boss,
               begin_date: new Date(2024, 0, 1),
            },
            create: {
                  user_id: user.id,
                  stack: 2,
                  short_name: profiles[key],
                  is_boss: is_boss,
                  begin_date: new Date(2024, 0, 1),
            }

         }).finally(() => console.log(`\x1b[32mProfile for user \"${key}\" created\x1b[0m`));
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

   const seedCalendar = async () => {
      let calendar = await prisma.production_calendar.findFirst({ where: { year: 2024 } });
      if (!calendar) {
         calendar = await prisma.production_calendar.create({ data: { year: 2024 } });
      }
      const _count = production_calendar.length;
      let _index = 0;
      while (_index < _count) {         
         let _node = production_calendar[_index];
         try {
            const _date = new Date(_node.date);
            const exclusion = await prisma.exclusion.findFirst({ where: { production_calendar_id: calendar.id, date: _date } });
            if (exclusion) {
               await prisma.exclusion.update({
                  where: {
                     id: exclusion.id
                  },
                  data: {
                     exclusion_type: _node.exclusion_type
                  }
               });
            } else {
               await prisma.exclusion.create({
                  data: {
                     production_calendar_id: calendar?.id,
                     date: _date,
                     exclusion_type: _node.exclusion_type
                  }
               });
            }
            _index++;
         } catch (error) {
            throw new Error(`Не удалось создать запись календаря: ${_node.date}`);
         }
      }
      return _index;
   }

   await seedProjects().finally(() => console.log(`\x1b[32mProjects seeded\x1b[0m`))
   await seedCalendar().finally(() => console.log(`\x1b[32mProduction calendar seeded\x1b[0m`))
}

main().then(async () => {
   await prisma.$disconnect();
})
.catch(async (e) => {
   console.log(e);
   await prisma.$disconnect();
   process.exit(1);
})