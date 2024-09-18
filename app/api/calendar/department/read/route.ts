import { ICalendar, ICalendarCell, ICalendarFooter, ICalendarRow } from "@/models/ICalendar";
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
         header: { name: 'Фамилия', days: dayArray, hours: 'Всего', total: 'От начала года' },
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
         const _cells = await prisma.dept_calendar_cell.findMany({
            where: {
               row_id: _row.id,
               month: month
            },
            orderBy: {
               day: 'asc'
            }
         });

         const _sum = _cells.map(i => i.hours).reduce((part, a) => part + a, 0);
         const cells:ICalendarCell[] = _cells.map(i => {
            return {
               day: i.day,
               type: i.type,
               hours: i.hours,
            }
         })
         
         const _total = await prisma.dept_calendar_cell.aggregate({
            where: {
               row_id: _row.id,
               month: {
                  lte: month
               }
            },
            _sum: {
               hours: true
            }
         })
         
         const row: ICalendarRow = {
            name: _row.rate_id ? _row.header : 'Вакансия',
            cells: cells,
            hours: _sum,
            total: _total._sum.hours??0
         }

         result.rows?.push(row);
      }
      
      const _footer: ICalendarFooter = {name: 'Итого', hours: [], sum: undefined, total: 0};

      for (const _day of dayArray) {
         const _sum = await prisma.dept_calendar_cell.aggregate({
            where: {
               day: _day,
               month: month,
               row: {
                  calendar: {
                     division_id: division_id
                  }
               }
            },
            _sum: {
               hours: true
            }
         });

         _footer.hours?.push(_sum._sum.hours??0);
      }

      _footer.sum = _footer.hours?.reduce((item, a) => item + a, 0);
      //ts-ignore
      //_footer.total = result.rows?.map(i => i.total).reduce((item, a) => item??0 + a, 0);
      _footer.total = 0;
      for (const _row of result.rows??[]) {
         _footer.total += _row.total??0;
      }
      result.footer = _footer;
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}