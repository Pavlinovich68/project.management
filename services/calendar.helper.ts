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

   dropVacationDay = async (staff_id: number, year: number, month: number, day: number) => {
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
      if (!_cell) return;
      await prisma.dept_calendar_cell.update({
         where: {id: 1},
         data: {
            type: 4
         }
      })
   }
}