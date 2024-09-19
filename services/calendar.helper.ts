import { ICalendarCell } from "@/models/ICalendar";
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

   dropVacationDay = async (division_id: number, staff_id: number, year: number, month: number, day: number) => {
      const _calendar = await prisma.dept_calendar.findFirst({
         where: {
            division_id: division_id,
            year: year
         }
      })
      if (!_calendar) return;
      const _row = await prisma.dept_calendar_row.findFirst({
         where: {
            calendar_id: _calendar.id
         }
      })
      const _cell = await prisma.dept_calendar_cell.findFirst({
         where: {
            month: month,
            day: day,
            row: {
               rate: {
                  staff: {
                     id: staff_id
                  }
               }
            }
         }
      });
      await prisma.dept_calendar_cell.delete({
         where: {
            month: month,
            day: day,
            row_id: 1,
            id: 1
         }
      })
   }
}