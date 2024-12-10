import prisma from "./client";
import {appRoles} from "./roles";
import bcrypt from "bcrypt";
import divisions from "./data/divisions";
import projects from "./data/projects.json";
import employee from "./data/employee.json";
import production_calendar from "./data/calendar.json";
import roadmap_data from "./data/roadmap.json";
import vacations from "./data/vacation.json";
import DateHelper from "@/services/date.helpers";
import { IBaseEntity } from "@/models/IBaseEntity";

// TODO Seed
async function main() {
   interface IEmployee {
      name: string,
      email: string,
      contacts: string,
      begin_date: string,
      end_date: string | null,
      post: string,
      role: {
         name: string,
         description: string
      }
      no: number
   }

   await prisma.$queryRaw`delete from users`;
   await prisma.$queryRaw`delete from staff`;
   await prisma.$queryRaw`delete from roadmap_fact_item`;
   await prisma.$queryRaw`delete from control_point`;
   await prisma.$queryRaw`delete from roadmap_item`;
   await prisma.$queryRaw`delete from project`;
   await prisma.$queryRaw`delete from employee`;
   await prisma.$queryRaw`delete from dept_calendar_cell`;
   await prisma.$queryRaw`delete from dept_calendar_row`;
   await prisma.$queryRaw`delete from dept_calendar`;
   await prisma.$queryRaw`delete from vacation`;
   await prisma.$queryRaw`delete from staff`;
   await prisma.$queryRaw`delete from rate`;
   await prisma.$queryRaw`delete from post`;

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

   const createUser = async (emp: IEmployee, id: number) => {
      const hashPassword = await bcrypt.hashSync(`localhost`, 8);
      const role: Record<string, string> = {};
      role[emp.role.name] = emp.role.description;
      await prisma.users.upsert({
         where: {employee_id: id},
         update: {
            password: hashPassword,
            roles: role,
         },
         create: {
            employee_id: id,
            password: hashPassword,
            roles: role
         }
      });
   }

   const seedProjects = async () => {
      try {
         const _count = projects.length;
         let _index = 0;
         const parent: IBaseEntity = {};         
         while (_index < _count) {            
            let _node = projects[_index];
            if (!_node.parent) {
               parent.id = null;
            } else {
               const _parent = await prisma.project.findFirst({where: {code: _node.parent}});
               parent.id = _parent?.id
            }
            await prisma.project.create({
               data: {
                  code: _node.code,
                  name: _node.name,
                  parent_id: parent.id
               }
            });
            _index++;
         }
         return _index;  
      } catch (error) {
         throw error;
      }      
   }

   const seedRoadmap = async () => {
      const roadmap = await prisma.roadmap.create({data: {year: 2024, division_id: division?.id??0}});
      const count = roadmap_data.length;
      let index = 0;
      while (index < count) {
         const item = roadmap_data[index];
         let project = undefined;
         try {
            project = await prisma.project.findFirst({where: {code: item.project}});
            if (!project)
               throw new Error(`Не удалось получить проект ${item.project}`)
         } catch (error) {
            throw new Error(`Не удалось получить проект ${item.project}`)
         }

         const rmi = await prisma.roadmap_item.create({
            data: {
               hours: item.hours,
               comment: item.comment,
               project_id: project.id,
               roadmap_id: roadmap.id,
               begin_date: new Date(item.begin_date)
            }
         })

         for (const fact_item of item.fact) {
            await prisma.roadmap_fact_item.create({
               data: {
                  date: new Date(fact_item.date),
                  hours: fact_item.hours,
                  employee_id: fact_item.employee_id,
                  roadmap_item_id: rmi.id
               }
            });
         }

         // for (const point of item.control_points) {
         //    await prisma.control_point.create({
         //       data: {
         //          roadmap_item_id: rmi.id,
         //          name: point.name,
         //          date: new Date(point.date),
         //          type: point.type
         //       }
         //    })
         // }

         index++;
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
         const posts = [{name: 'Начальник отдела', level: 1}, {name: 'Главный специалист', level: 0}, {name: 'Ведущий техник-технолог', level: 0}];
         for (const post of posts){
            await prisma.post.create({
               data: {
                  name: post.name,
                  hierarchy_level: post.level
               }
            });
         }
      } catch (error) {
         throw error;
      }
   }

   const seedRate = async () => {
      try {         
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
         const posts = await prisma.post.findMany();
         
         const _count = employee.length;
         let _index = 0;
         while (_index < _count) {
            let _node = employee[_index] as IEmployee;
            const emp = await prisma.employee.create({
               data: {
                  name: _node.name,
                  email: _node.email,
                  contacts: _node.contacts,
                  begin_date: new Date(_node.begin_date),
                  end_date: null
               }
            });
            await createUser(_node, emp.id);
            _index++;
            if (_node.post) {
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
            const employee = await prisma.employee.findFirst({
               where: {
                  name: _node.name
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
   await seedRoadmap().finally(() => console.log(`\x1b[32mRoadmap seeded\x1b[0m`));
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