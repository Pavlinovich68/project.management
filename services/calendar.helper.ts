import prisma from "@/prisma/client";

export default class CalendarHelper {
   dropExclusionDay = async (id: number):Promise<boolean> => {      
      try {         
         const exlusion = await prisma.exclusion.findUnique({where: {id: id}});
         if (!exlusion) return false;
         
         const year = exlusion.date.getFullYear();
         const month = exlusion.date.getMonth() +1;
         const day = exlusion.date.getDate();
         const dayOfWeek = exlusion.date.getDay();
         const isHoliday = (dayOfWeek === 0 || dayOfWeek === 6);

         const calendars = await prisma.dept_calendar.findMany({where:{year: year}});
         for (const calendar of calendars) {
            await prisma.dept_calendar_cell.updateMany({
               where: {
                  row: {
                     calendar_id: calendar.id
                  },
                  month: month,
                  day: day
               },
               data: {
                  type: isHoliday ? 0 : 4
               }
            })
         }
         return true;
      } catch (error) {
         return false;
      }
   }
}