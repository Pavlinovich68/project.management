import { ICalendarCell } from "@/models/ICalendar";
import prisma from "@/prisma/client";

export default class CalendarHelper {
   // dropExclusionDay = async (id: number):Promise<boolean> => {      
   //    try {         
   //       const exlusion = await prisma.exclusion.findUnique({where: {id: id}});
   //       if (!exlusion) return false;
         
   //       const year = exlusion.date.getFullYear();
   //       const month = exlusion.date.getMonth() +1;
   //       const day = exlusion.date.getDate();
   //       const dayOfWeek = exlusion.date.getDay();
   //       const isHoliday = (dayOfWeek === 0 || dayOfWeek === 6);

   //       const calendars = await prisma.dept_calendar.findMany({where:{year: year}});
   //       for (const calendar of calendars) {
   //          await prisma.dept_calendar_cell.updateMany({
   //             where: {
   //                row: {
   //                   calendar_id: calendar.id
   //                },
   //                month: month,
   //                day: day
   //             },
   //             data: {
   //                type: isHoliday ? 0 : 4
   //             }
   //          })
   //       }
   //       return true;
   //    } catch (error) {
   //       return false;
   //    }
   // }

   // dropVacationDay = async (staff_id: number, year: number, month: number, day: number) => {
   //    const _cell = await prisma.$queryRaw`
   //       select
   //          dcc.id
   //       from
   //          dept_calendar_row dcr
   //          inner join dept_calendar_cell dcc on dcr.id = dcc.row_id
   //          inner join rate r on dcr.rate_id = r.id
   //          inner join staff s on r.id = s.rate_id
   //          inner join public.dept_calendar dc on dc.id = dcr.calendar_id
   //       where
   //          dc.year = ${year}
   //          and dcc.month = ${month}
   //          and dcc.day = ${day}
   //          and s.id = ${staff_id}
   //    `
   //    if (!_cell) return;
   //    await prisma.dept_calendar_cell.update({
   //       where: {id: 1},
   //       data: {
   //          type: 4
   //       }
   //    })
   // }

   static getEndDate = (date: Date, hours: number): Date => {
      let result = 0;
      const YEAR = date.getFullYear();
      const MONTH = date.getMonth();
      let _day = date.getDate();
      let _date = new Date(Date.UTC(YEAR, MONTH, _day));
      while (result <= hours) {
         const _dayOfWeek = _date.getDay();
         const _isHoliday = (_dayOfWeek === 0 || _dayOfWeek === 6);
         result += _isHoliday ? 0 : 8;
         _day++;
         _date = new Date(Date.UTC(YEAR, MONTH, _day));
      }
      _date.setDate(_date.getDate() -1);
      return _date;
   }
}