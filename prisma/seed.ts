import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";
import divisions from "./data/divisions";
import projects from "./data/projects.json";
import employee from "./data/employee.json";
import production_calendar from "./data/calendar.json";
import vacations from "./data/vacation.json";
import DateHelper from "@/services/date.helpers";

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
      name: string
      role: string
      email: string
      attachment_id?: number | null
   }
   
   const _users:UserInterface[] = [ 
      {
         name: "Администратор",
         role: "admin",
         email: "admin@localhost"
      },
      {
         name: "Руководитель",
         role: "boss",
         email: "boss@localhost"
      },
      {
         name: "Павлов С.П.",
         role: "master",
         email: "s.pavlov@localhost",
         attachment_id: 1
      },
      {
         name: "Савельев П.И.",
         role: "developer",
         email: "p.savelev@localhost"
      },
      {
         name: "Аналитик",
         role: "analyst",
         email: "analyst@localhost"
      },
      {
         name: "Тестировщик",
         role: "tester",
         email: "tester@localhost"
      },
      {
         name: "Только чтение",
         role: "read_only",
         email: "read_only@localhost"
      },
   ];
   
   for (const _user of _users) {
      const hashPassword = await bcrypt.hashSync(`localhost`, 8);
      const email = _user.email;
      const role: Record<string, string> = {};
      role[_user.role] = _user.name;
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
            const _division = await prisma.division.findFirst({where: {name: "Отдел автоматизации процессов и веб-технологий"}});
            const _calendar = await prisma.dept_calendar.findFirst({where:{year:2024,division_id:_division?.id}});

            let hours = 8;
            switch (_node.exclusion_type) {
               case 0: hours = 0; break;
               case 1: hours = 7; break;
               case 2: hours = 0; break;
               case 3: hours = 8; break;
            }
            if (_calendar) {
               const _cells = await prisma.dept_calendar_cell.updateMany({
                  where: {
                     row: {
                        calendar_id: _calendar.id
                     },
                     month: _date.getMonth() +1,
                     day: _date.getDate()
                  },
                  data: {
                     type: _node.exclusion_type,
                     hours: hours
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

   const seedProdCalendar = async () => {
      try {
         const _division = await prisma.division.findFirst({where: {name: "Отдел автоматизации процессов и веб-технологий"}});
         if (!_division) return
         const _calendar = await prisma.dept_calendar.create({
            data: { division_id: _division?.id, year: 2024 }
         })

         let rates = await prisma.rate.findMany({
            where: { division_id: _division.id },
            orderBy: { no: 'asc' }
         })

         for (const rate of rates) {
            const _worker = await prisma.staff.findFirst({
               where: {rate_id: rate.id},
               select: {employee: true}
            })
            
            const _row = await prisma.dept_calendar_row.create({
               data: {
                  no: rate.no,
                  calendar_id: _calendar.id,
                  rate_id: rate.id
               }
            });
            let _i = 0;
            while (_i < 366) {
               _i++
               let _date = new Date(Date.UTC(2024, 0, _i))
               const _dayOfWeek = _date.getDay();
               const _isHoliday = (_dayOfWeek === 0 || _dayOfWeek === 6);
               await prisma.dept_calendar_cell.create({
                  data: {
                     month: _date.getMonth() +1,
                     day: _date.getDate(),
                     hours: _isHoliday ? 0 : 8,
                     type: _isHoliday ? 0 : 4,
                     row_id: _row.id
                  }
               });
            }
         }
      } catch (error) {
         throw error;
      }
   }

   const seedPosts = async () => {
      try {
         await prisma.$queryRaw`delete from dept_calendar_cell`;
         await prisma.$queryRaw`delete from dept_calendar_row`;
         await prisma.$queryRaw`delete from dept_calendar`;
         await prisma.$queryRaw`delete from vacation`;
         await prisma.$queryRaw`delete from staff`;
         await prisma.$queryRaw`delete from rate`;
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

   const seedRate = async () => {
      try {
         await prisma.$queryRaw`delete from dept_calendar_cell`;
         await prisma.$queryRaw`delete from dept_calendar_row`;
         await prisma.$queryRaw`delete from dept_calendar`;
         await prisma.$queryRaw`delete from rate`;
         const division = await prisma.division.findUnique({
            where: {
               name: 'Отдел автоматизации процессов и веб-технологий'
            }
         });
         if (!division) {
            throw new Error('Не удалось найти подразделение');
         }
         const units = [
            { "name": 'Начальник отдела', "no": 1 }, 
            { "name": 'Главный специалист', "no": 2 }, 
            { "name": 'Главный специалист', "no": 3 }, 
            { "name": 'Главный специалист', "no": 4 }, 
            { "name": 'Главный специалист', "no": 5 }, 
            { "name": 'Главный специалист', "no": 6 }, 
            { "name": 'Главный специалист', "no": 7 }, 
            { "name": 'Главный специалист', "no": 8 }, 
            { "name": 'Главный специалист', "no": 9 }, 
            { "name": 'Главный специалист', "no": 10 }, 
            { "name": 'Главный специалист', "no": 11 }, 
            { "name": 'Главный специалист', "no": 12 }, 
            { "name": 'Главный специалист', "no": 13 }, 
            { "name": 'Главный специалист', "no": 14 }, 
            { "name": 'Главный специалист', "no": 15 }, 
            { "name": 'Ведущий техник-технолог', "no": 16 },
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
            await prisma.rate.create({
               data: {
                  no: unit.no,
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
            const rate = await prisma.rate.findFirst({
               where: {
                  post_id: post.id,
                  division_id: division.id,
                  no: _node.no
               }
            });
            if (!rate)
               throw new Error(`Не удалось найти ставку ${_node.no}`);
            if (!emp)
               throw new Error('Не удалось найти сотрудника');
            await prisma.staff.create({
               data: {
                  begin_date: new Date(2024, 0, 1),
                  employee_id: emp.id,
                  rate_id: rate.id
               }
            })
         }
         return _index;  
      } catch (error) {
         throw error;
      }      
   }

   const getVacationDayId = async (staff_id: number, year: number, month: number, day: number) => {
      try {
         const _cell = await prisma.$queryRaw`
            select
               dcc.id
            from
               dept_calendar_row dcr
               inner join dept_calendar_cell dcc on dcr.id = dcc.row_id
               inner join rate r on dcr.rate_id = r.id
               inner join staff s on r.id = s.rate_id
               inner join public.dept_calendar dc on dc.id = dcr.calendar_id
            where
               dc.year = ${year}
               and dcc.month = ${month}
               and dcc.day = ${day}
               and s.id = ${staff_id}
         `
         //@ts-ignore
         const result = _cell ? _cell[0].id : undefined;
         return result;
      } catch (error) {
         throw new Error(`Ошибка поиска ячейки - staff-id:${staff_id}, year:${year}, month:${month}, day${day}`)
      }      
   }

   const addDays = (date: Date, days: number): Date => {
      var _date = new Date(date.valueOf());
      _date.setDate(_date.getDate() + days);
      return _date;
   }
   
   const createVacation = async (staff_id: number, start_date: Date, end_date: Date) => {
      let _start_date = new Date(start_date);
      const _end_date = new Date(end_date);
      while(_start_date <= _end_date){      
         const _year = _start_date.getFullYear();   
         const _month = _start_date.getMonth();
         const _day = _start_date.getDate();         
         
         const _row_id = await getVacationDayId(staff_id, _year, _month+1, _day)

         await prisma.dept_calendar_cell.updateMany({
            where: {
               id: _row_id
            },
            data: {
               type: 5,
               hours: 0
            }
         })

         _start_date = addDays(_start_date, 1);
      }
   }

   const seedVacations = async () => {
      try {         
         const _count = vacations.length;
         let _index = 0;         
         while (_index < _count) {
            const _node = vacations[_index];
            const names = _node.name.split(' ');
            const employee = await prisma.employee.findFirst({
               where: {
                  surname: names[0],
                  name: names[1],
                  pathname: names[2]
               }
            });
            const staff = await prisma.staff.findFirst({
               where: {
                  employee_id: employee?.id,
               }
            });
            const vac = await prisma.vacation.create({
               data: {
                  year: 2024,
                  start_date: new Date(_node.start_date),
                  end_date: new Date(_node.end_date),
                  staff_id: staff?.id,
               }
            });
            await createVacation(vac.staff_id, vac.start_date, vac.end_date);
            _index++;
         }         
      } catch (error) {
         throw error;
      }
   }  
   
   await seedProjects().finally(() => console.log(`\x1b[32mProjects seeded\x1b[0m`));
   await seedPosts().finally(() => console.log(`\x1b[32mPosts seeded\x1b[0m`));
   await seedRate().finally(() => console.log(`\x1b[32mRates seeded\x1b[0m`));
   await seedEmployees().finally(() => console.log(`\x1b[32mEmployees seeded\x1b[0m`));
   await seedProdCalendar().finally(() => console.log(`\x1b[32mWorked calendar seeded\x1b[0m`));
   await seedCalendar().finally(() => console.log(`\x1b[32mProduction calendar seeded\x1b[0m`));
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