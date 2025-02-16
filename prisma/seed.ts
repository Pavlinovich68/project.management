import prisma from "./client";
import divisions from "./data/division.json";
import employees from "./data/employee.json";
import posts from "./data/post.json";
import production_calendar from "./data/production_calendar.json";
import projects from "./data/project.json";
import rates from "./data/rate.json";
import staff from "./data/staff.json";
import users from "./data/users.json";
import vacations from "./data/vacation.json";
import exclusions from "./data/exclusion.json";

// TODO Seed
async function main() {
   const seedDivision = async () => {      
      try {
         for (const item of divisions) {
            await prisma.division.create({
               data: {
                  id: item.id,
                  name: item.name,
                  parent_id: item.parent_id
               }
            });
         }

         const row = await prisma.$queryRaw`select max(id) from division`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('division_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedEmployee = async () => {
      try {
         for (const item of employees) {
            await prisma.employee.create({
               data: {
                  id: item.id,
                  name: item.name,
                  begin_date: new Date(item.begin_date),
                  end_date: item.end_date ? new Date(item.begin_date) : null,
                  email: item.email,
                  contacts: item.contacts,
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from employee`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('employee_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }      
   }

   const seedPost = async () => {
      try {
         for (const item of posts) {
            await prisma.post.create({
               data: {
                  id: item.id,
                  name: item.name,
                  hierarchy_level: item.hierarchy_level
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from post`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('post_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedProductionCalendar = async () => {
      try {
         for (const item of production_calendar) {
            await prisma.production_calendar.create({
               data: {
                  id: item.id,
                  year: item.year
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from production_calendar`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('production_calendar_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedExclusions = async () => {
      try {
         for (const item of exclusions) {
            await prisma.exclusion.create({
               data: {
                  id: item.id,
                  exclusion_type: item.exclusion_type,
                  production_calendar_id: item.production_calendar_id,
                  date: new Date(item.date)
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from exclusion`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('exclusion_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedProject = async () => {
      try {
         for (const item of projects) {
            await prisma.project.create({
               data: {
                  id: item.id,
                  code: item.code,
                  name: item.name,
                  parent_id: item.parent_id
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from project`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('project_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedRates = async () => {
      try {
         for (const item of rates) {
            await prisma.rate.create({
               data: {
                  id: item.id,
                  post_id: item.post_id,
                  division_id: item.division_id,
                  no: item.no,
                  is_work_time: item.is_work_time
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from rate`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('rate_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedStaffs = async () => {
      try {
         for (const item of staff) {
            await prisma.staff.create({
               data: {
                  id: item.id,
                  employee_id: item.employee_id,
                  rate_id: item.rate_id,
                  begin_date: new Date(item.begin_date),
                  end_date: item.end_date ? new Date(item.end_date) : null
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from staff`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('staff_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedUsers = async () => {
      try {
         for (const item of users) {
            await prisma.users.create({
               data: {
                  id: item.id,
                  password: item.password,
                  roles: item.roles,
                  attachment_id: item.attachment_id,
                  emailVerified: item.emailVerified,
                  restoreGuid: item.restoreGuid,
                  restoreTime: item.restoreTime,
                  employee_id: item.employee_id
               }
            });
         }

         const row = await prisma.$queryRaw`select max(id) from users`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('users_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedVacations = async () => {
      try {
         for (const item of vacations) {
            await prisma.vacation.create({
               data: {
                  id: item.id,
                  start_date: new Date(item.start_date),
                  end_date: new Date(item.end_date),
                  year: item.year,
                  staff_id: item.staff_id
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from vacation`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('vacation_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   try {
      await seedDivision().finally(() => console.log(`\x1b[32mDivisions seeded\x1b[0m`));
      await seedEmployee().finally(() => console.log(`\x1b[32mEmployees seeded\x1b[0m`));
      await seedPost().finally(() => console.log(`\x1b[32mPosts seeded\x1b[0m`));
      await seedProductionCalendar().finally(() => console.log(`\x1b[32mProduction calendars seeded\x1b[0m`));
      await seedExclusions().finally(() => console.log(`\x1b[32mExclusions seeded\x1b[0m`));
      await seedProject().finally(() => console.log(`\x1b[32mProjects seeded\x1b[0m`));
      await seedRates().finally(() => console.log(`\x1b[32mRates seeded\x1b[0m`));
      await seedStaffs().finally(() => console.log(`\x1b[32mStaffs seeded\x1b[0m`));
      await seedUsers().finally(() => console.log(`\x1b[32mUsers seeded\x1b[0m`));
      await seedVacations().finally(() => console.log(`\x1b[32mVacations seeded\x1b[0m`));
   } catch (error) {
      throw error;
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