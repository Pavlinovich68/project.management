import { ICalendar, ICalendarCell, ICalendarFooter, ICalendarRow } from "@/models/ICalendar";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const buildRow = async (year: number, month: number, days: number[], row_id: number, calendar_id: number): Promise<ICalendarRow> => {
   const now = new Date(year, month, 0)
   const staff = await prisma.staff.findFirst({
      where: {
         AND: [
            { rate_id: row_id },
            { begin_date: { lte: now } },
            { OR: [
               {
                  end_date: null
               },
               {
                  end_date: { gt: now }
               }
            ]}
         ]
      },
      include: {
         employee: true
      }
   });
   const row: ICalendarRow = {
      name: staff ? `${staff.employee.surname} ${staff.employee.name?.charAt(0)}.${staff.employee.pathname?.charAt(0)}` : 'Вакансия',
      cells: [],
      hours: 0,
      total: 0
   }

   for (const day of days) {
      const cell = await buildCell(year, month, day, staff);
      row.cells?.push(cell);
      row.hours += cell.hours;
   }

   return row;
}

// 0  - holiday            Выходной или праздничный   0
// 1  - reduced            Предпраздничный            7
// 2  - holiday transfer   Перенесенный выходной      0
// 3  - worked transfer    Перенесенный рабочий       8
// 4  - worked             Рабочий                    8
// 5  - vacation           Отпуск                     0
// 6  - hospital           Больничный                 0
// 7  - without pay        Без содержания             0
// 8  - absense from work  Прогул                     0
// 9  - vacancy            Вакансия                   0
// 10 - work on weekends   Работа в выходной          8
const buildCell = async (year: number, month: number, day: number, staff: any):Promise<ICalendarCell> => {
   const result = {
      id: 0,
      day: day,
      type: -1,
      hours: 0
   }
   return result
}

const previewHours = async (): Promise<number> => {
   return 0
}

const buildFooter = async (): Promise<ICalendarFooter> => {
   const result = {
      name: '',
      hours: [],
      sum: 0,
      total: 0
   };
   return result;
}

export const POST = async (request: NextRequest) => {
   try {
      const { division_id, year, month } = await request.json();
// Календарь
      const _calendar = await prisma.dept_calendar.findFirst({
         where: {
            year: year,
            division_id: division_id
         }
      });

      if (!_calendar)
         return await NextResponse.json({status: 'error', data: "Календарь не обнаружен!" });
// Колонки
      const dayCount = new Date(year, month, 0).getDate();
      const dayArray = Array.from(Array(dayCount+1).keys()).filter(i => i>0);
// Выходная модель
      const result: ICalendar = {
         year: year,
         month: month,
         header: { name: 'Фамилия', days: dayArray, hours: 'Всего', total: 'От начала' },
         rows: [],
         footer: undefined
      }
      
      const rows = await prisma.rate.findMany({
         where: {
            division_id: division_id
         },
         orderBy: {
            no: 'asc'
         }
      });

      for (const row of rows) {
         const calendarRow = await buildRow(year, month, dayArray, row.id, _calendar.id);
         const prevHours = await previewHours();
         calendarRow.total = calendarRow?.hours + prevHours;
         result.rows?.push(calendarRow);
         result.footer = await buildFooter();
      }
      // const _rows = await prisma.dept_calendar_row.findMany({
      //    where: {
      //       calendar_id: _calendar.id
      //    },
      //    orderBy: {
      //       rate: {
      //          no: 'asc'
      //       }
      //    }
      // });

      // for (const _row of _rows) {
      //    const _staff = await prisma.staff.findFirst({ 
      //       where: {
      //          rate_id: _row.rate_id,
      //          begin_date: {
      //             lte: new Date()
      //          },
      //          OR: [
      //             {
      //                end_date: {
      //                   gte: new Date()
      //                }
      //             },
      //             {
      //                end_date: null
      //             }
      //          ]
      //       } 
      //    });
      //    let _rowHeader = 'Вакансия';
      //    if (_staff) {
      //       const _employee = await prisma.employee.findFirst({ where: {id: _staff.employee_id } });
      //       if (_employee) {
      //          _rowHeader = _employee.surname + ' ' + _employee.name?.charAt(0) + '.' + _employee.pathname?.charAt(0) + '.'
      //       } else {
      //          _rowHeader = 'Вакансия';
      //       }
      //    }

      //    const _cells = await prisma.dept_calendar_cell.findMany({
      //       where: {
      //          row_id: _row.id,
      //          month: month
      //       },
      //       orderBy: {
      //          day: 'asc'
      //       }
      //    });

      //    const _sum = _cells.map(i => i.hours).reduce((part, a) => part + a, 0);
      //    const cells:ICalendarCell[] = _cells.map(i => {
      //       return {
      //          id: i.id,
      //          day: i.day,
      //          type: i.type,
      //          hours: i.hours,
      //       }
      //    })
         
      //    const _total = await prisma.dept_calendar_cell.aggregate({
      //       where: {
      //          row_id: _row.id,
      //          month: {
      //             lte: month
      //          }
      //       },
      //       _sum: {
      //          hours: true
      //       }
      //    })
         
      //    const row: ICalendarRow = {
      //       name: _rowHeader,
      //       cells: cells,
      //       hours: _sum,
      //       total: _total._sum.hours??0
      //    }

      //    result.rows?.push(row);
      // }
      
      // const _footer: ICalendarFooter = {name: 'Итого', hours: [], sum: undefined, total: 0};

      // for (const _day of dayArray) {
      //    const _sum = await prisma.dept_calendar_cell.aggregate({
      //       where: {
      //          day: _day,
      //          month: month,
      //          row: {
      //             calendar: {
      //                division_id: division_id
      //             }
      //          }
      //       },
      //       _sum: {
      //          hours: true
      //       }
      //    });

      //    _footer.hours?.push(_sum._sum.hours??0);
      // }

      // _footer.sum = _footer.hours?.reduce((item, a) => item + a, 0);
      // _footer.total = 0;
      // for (const _row of result.rows??[]) {
      //    _footer.total += _row.total??0;
      // }
      // result.footer = _footer;
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}