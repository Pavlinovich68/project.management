import { ICalendar, ICalendarCell, ICalendarRow } from "@/models/ICalendar";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { division_id, year, month } = await request.json();

      const _calendar = await prisma.dept_calendar.findFirst({
         where: {
            year: year,
            division_id: division_id
         }
      });

      if (!_calendar)
         return await NextResponse.json({status: 'error', data: "Календарь не обнаружен!" });

      const dayCount = new Date(year, month, 0).getDate();
      const dayArray = Array.from(Array(dayCount+1).keys()).filter(i => i>0);

      const result: ICalendar = {
         year: year,
         month: month,
         header: {name: 'Фамилия', days: dayArray, hours: 'Часов', total: 'Всего' },
         rows: [],
         footer: undefined
      }
      
      const _rows = await prisma.dept_calendar_row.findMany({
         where: {
            calendar_id: _calendar.id
         },
         orderBy: {
            rate: {
               no: 'asc'
            }
         }
      });

      for (const _row of _rows) {
         const _startDate = new Date(year, month-1, 1);
         const _endDate = new Date(year, month, 0);
         const _cells = await prisma.dept_calendar_cell.findMany({
            where: {
               AND: [
                  {
                     row_id: _row.id
                  },
                  {
                     date: { gte: _startDate },                     
                  },
                  {
                     date: { lte: _endDate }      
                  }
               ]
            },
            orderBy: {
               date: 'asc'
            }
         });

         const _sum = _cells.map(i => i.hours).reduce((part, a) => part + a, 0);
         const cells:ICalendarCell[] = _cells.map(i => {
            return {
               day: i.date.getDate(),
               type: i.type,
               hours: i.hours,
            }
         })
         const row: ICalendarRow = {
            name: _row.rate_id ? _row.header : 'Вакансия',
            cells: cells,
            hours: _sum,
            total: 0
         }

         result.rows?.push(row);
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}