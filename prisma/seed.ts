import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";
import divisions from "./data/divisions";
import projects from "./data/projects.json";
import employee from "./data/employee.json";
import production_calendar from "./data/calendar.json";
import vacations from "./data/vacation.json";

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
   
   interface UserInterface {
      name: string;
      role: string;
      prefix: string;
   }
   
   const _users:UserInterface[] = [ 
      {
         name: "Администратор",
         role: "admin",
         prefix: "administrator"
      },
      {
         name: "Руководитель",
         role: "boss",
         prefix: "boss"
      },
      {
         name: "Начальник отдела",
         role: "master",
         prefix: "master"
      },
      {
         name: "Разработчик",
         role: "developer",
         prefix: "developer"
      },
      {
         name: "Аналитик",
         role: "analyst",
         prefix: "analyst"
      },
      {
         name: "Тестировщик",
         role: "tester",
         prefix: "tester"
      },
      {
         name: "Только чтение",
         role: "read_only",
         prefix: "read_only"
      },
   ];
   
   for (const _user of _users) {
      const hashPassword = await bcrypt.hashSync(`${_user.prefix}1!`, 8);
      const email = `${_user.prefix}@localhost`;
      const role: Record<string, string> = {};
      role[_user.name] = _user.role;
      if (division) {
         const user = await prisma.users.upsert({
            where: {email: email},
            update: {
               name: _user.name,
               password: hashPassword,
               roles: role,
               begin_date: new Date(),
               division_id: division.id,
            },
            create: {
                  email: email,
                  name: _user.name,
                  password: hashPassword,
                  begin_date: new Date(),
                  roles: role,
                  division_id: division.id
            }
         }).finally(() => console.log(`\x1b[32mUser \"${_user.name}\" created\x1b[0m`));
      }
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

   const seedPosts = async () => {
      try {
         await prisma.$queryRaw`delete from post`;
         const posts: string[] = ['Начальник отдела', 'Главный специалист', 'Ведущий техник-технолог'];
         for (const post of posts){
            await prisma.post.create({
               data: {
                  name: post
               }
            });
         }
      } catch (error) {
         throw error;
      }
   }

   const seedStuffUnits = async () => {
      try {
         await prisma.$queryRaw`delete from stuff_unit`;
         const division = await prisma.division.findUnique({
            where: {
               name: 'Отдел автоматизации процессов и веб-технологий'
            }
         });
         if (!division) {
            throw new Error('Не удалось найти подразделение');
         }
         const units = [
            { "name": 'Начальник отдела', "count": 1 }, 
            { "name": 'Главный специалист', "count": 14 }, 
            { "name": 'Ведущий техник-технолог', "count": 1 },
         ];
         for (const unit of units) {
            const post = await prisma.post.findFirst({
               where: {
                  name: unit.name
               }
            });
            if (!post) {
               throw new Error('Не удалось найти должность');
            }
            await prisma.stuff_unit.create({
               data: {
                  count: unit.count,
                  post_id: post.id,
                  division_id: division.id,
               }
            });
         }
      } catch (error) {
         throw error;
      }
   }

   const seedEmployees = async () => {
      try {
         await prisma.$queryRaw`delete from employee`;

         const posts = await prisma.post.findMany();
         
         const _count = employee.length;
         let _index = 0;
         while (_index < _count) {
            let _node = employee[_index];
            const emp = await prisma.employee.create({
               data: {
                  name: _node.name,
                  surname: _node.surname,
                  pathname: _node.pathname,
                  email: _node.email,
                  begin_date: new Date(_node.begin_date),
                  end_date: null
               }
            });
            _index++;

            const post = posts.find(p => p.name === _node.post);
            if (!post)
               throw new Error('Не удалось найти должность');
            if (!division)
               throw new Error('Не удалось найти подразделение');
            const staff_unit = await prisma.stuff_unit.findFirst({
               where: {
                  post_id: post.id,
                  division_id: division.id
               }
            });
            if (!staff_unit)
               throw new Error('Не удалось найти ставку');
            if (!emp)
               throw new Error('Не удалось найти сотрудника');
            await prisma.state_unit.create({
               data: {
                  employee_id: emp.id,
                  stuff_unit_id: staff_unit.id
               }
            })
         }
         return _index;  
      } catch (error) {
         throw error;
      }      
   }

   const seedVacations = async () => {
      try {
         await prisma.$queryRaw`delete from vacation`;
         const _count = vacations.length;
         let _index = 0;         
         while (_index < _count) {
            const _node = vacations[_index];
            const start_date = new Date(_node.start_date)
            const end_date = new Date(_node.end_date)
            const names = _node.name.split(' ');
            const employee = await prisma.employee.findFirst({
               where: {
                  surname: names[0],
                  name: names[1],
               }
            });
            const state_unit = await prisma.state_unit.findFirst({
               where: {
                  employee_id: employee?.id,
               }
            });
            await prisma.vacation.create({
               data: {
                  year: 2024,
                  start_date: new Date(_node.start_date),
                  end_date: new Date(_node.end_date),
                  state_unit_id: state_unit?.id,
               }
            });
            _index++;
         }         
      } catch (error) {
         throw error;
      }
   }  
   
   await seedProjects().finally(() => console.log(`\x1b[32mProjects seeded\x1b[0m`));
   await seedCalendar().finally(() => console.log(`\x1b[32mProduction calendar seeded\x1b[0m`));
   await seedPosts().finally(() => console.log(`\x1b[32mPosts seeded\x1b[0m`));
   await seedStuffUnits().finally(() => console.log(`\x1b[32mStuff units seeded\x1b[0m`));
   await seedEmployees().finally(() => console.log(`\x1b[32mEmployees seeded\x1b[0m`));
   await seedVacations().finally(() => console.log(`\x1b[32mVacations seeded\x1b[0m`));

}

main().then(async () => {
   await prisma.$disconnect();
})
.catch(async (e) => {
   console.log(e);
   await prisma.$disconnect();
   process.exit(1);
})