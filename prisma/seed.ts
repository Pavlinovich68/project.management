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
import control_points from "./data/control_point.json";
import roadmaps from "./data/roadmap.json";
import roadmap_items from "./data/roadmap_item.json";
import roadmap_fact_items from './data/roadmap_fact_item.json';
import attachment from "./data/attachment.json";

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
                  end_date: item.end_date ? new Date(item.end_date) : null,
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
                  is_production_staff: item.is_production_staff
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

   const seedRoadmaps = async () => {
      try {
         for (const item of roadmaps) {
            await prisma.roadmap.create({
               data: {
                  id: item.id,
                  year: item.year,
                  division_id: item.division_id
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from roadmap`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('roadmap_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedRoadmapItems = async () => {
      try {
         for (const item of roadmap_items) {
            await prisma.roadmap_item.create({
               data: {
                  id: item.id,
                  comment: item.comment,
                  roadmap_id: item.roadmap_id,
                  project_id: item.project_id,
                  hours: item.hours,
                  is_closed: item.is_closed
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from roadmap_item`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('roadmap_item_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedControlPoints = async () => {
      try {
         for (const item of control_points) {
            await prisma.control_point.create({
               data: {
                  id: item.id,
                  date: new Date(item.date),
                  name: item.name,
                  type: item.type,
                  roadmap_item_id: item.roadmap_item_id
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from control_point`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('control_point_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedAttachments = async () => {
      try {
         for (const item of attachment) {
            await prisma.attachment.create({
               data: {
                  id: item.id,
                  filename: item.filename,
                  object_name: item.object_name,
                  bucket_name: item.bucket_name,
                  date: new Date(item.date),
                  size: item.size,
                  type: item.type,
                  etag: item.etag
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from control_point`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('control_point_id_seq', ${maxId}, true)`;
      } catch (error) {
         throw error;
      }
   }

   const seedRoadmapFactItem = async () => {
      try {
         for (const item of roadmap_fact_items) {
            await prisma.roadmap_fact_item.create({
               data: {
                  id: item.id,
                  month: item.month,
                  day: item.day,
                  ratio: item.ratio,
                  note: item.note,
                  employee_id: item.employee_id,
                  roadmap_item_id: item.roadmap_item_id
               }
            })
         }

         const row = await prisma.$queryRaw`select max(id) from roadmap_fact_item`;
         //@ts-ignore
         const maxId = row[0].max +1;
         await prisma.$queryRaw`SELECT setval('roadmap_fact_item_id_seq', ${maxId}, true)`;
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
      await seedRoadmaps().finally(() => console.log(`\x1b[32mRoadmaps seeded\x1b[0m`));
      await seedRoadmapItems().finally(() => console.log(`\x1b[32mRoadmap items seeded\x1b[0m`));
      await seedControlPoints().finally(() => console.log(`\x1b[32mControl points seeded\x1b[0m`));      
      await seedAttachments().finally(() => console.log(`\x1b[32mAttachments seeded\x1b[0m`));      
      await seedRoadmapFactItem().finally(() => console.log(`\x1b[32mRoadmap Fact Items seeded\x1b[0m`));      
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