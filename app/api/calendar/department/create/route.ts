import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { division_id, year } = await request.json();
      let _calendar = await prisma.dept_calendar.findFirst({
         where: { division_id, year }
      });

      if (!_calendar) {
         _calendar = await prisma.dept_calendar.create({
            data: { division_id, year }
         })
      }
      
      // Строки

      await prisma.dept_calendar_cell.deleteMany({
         where: {
            row: {
               calendar_id: _calendar.id
            }
         }
      })

      await prisma.dept_calendar_row.deleteMany({
         where: {
            calendar_id: _calendar.id
         }
      })

      let rates = await prisma.rate.findMany({
         where: { division_id },
         orderBy: { no: 'asc' }
      })
      
      //Holidays      
      const _daysCount = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      for (const rate of rates) {
         const _worker = await prisma.staff.findFirst({
            where: {rate_id: rate.id},
            select: {employee: true}
         })

         let _workerName = 'Вакансия';
         if (_worker) {
            _workerName = _worker.employee.surname + ' ' + _worker.employee.name?.charAt(0) + '.' + _worker.employee.pathname?.charAt(0) + '.'
         }
         

         const _row = await prisma.dept_calendar_row.create({
            data: {
               calendar_id: _calendar.id,
               rate_id: rate.id,
               header: _workerName
            }
         });
         let _i = 0;
         while (_i < _daysCount) {
            _i++
            let _date = new Date(Date.UTC(year, 0, _i))
            const _dayOfWeek = _date.getDay();
            const _isHoliday = (_dayOfWeek === 0 || _dayOfWeek === 6);
            await prisma.dept_calendar_cell.create({
               data: {
                  date: _date,
                  hours: _isHoliday ? 0 : 8,
                  type: _isHoliday ? 0 : 4,
                  row_id: _row.id
               }
            });
         }
      }
      //NOTE Исключения на основе производственного календаря
      const _prod_calendar = await prisma.production_calendar.findFirst({
         where: {year: year, },
         include: {
            exclusions: true,
         }
      });

      if (_prod_calendar) {
         for (const _item of _prod_calendar?.exclusions) {
            let _hours: number = 0;
            switch (_item.exclusion_type) {
               case 0: _hours = 0; break
               case 1: _hours = 7; break
               case 2: _hours = 0; break
               case 3: _hours = 8; break
               default: _hours = 0; break
            }
            for (const rate of rates) {
               const _rows = await prisma.dept_calendar_row.findMany({
                  where: { calendar_id: _calendar.id }, 
                  select: {
                     id: true,
                     rate: {
                        select: {
                           staff: true
                        }
                     }
                  }
               })
               for (const _row of _rows) {
                  if (_row) {
                     const _cell = await prisma.dept_calendar_cell.findFirst({
                        where: {
                           date: _item.date,
                           row_id: _row.id
                        }
                     });

                     if (_cell) {
                        await prisma.dept_calendar_cell.update({
                           where: {
                              id: _cell.id
                           },
                           data: {
                              type: _item.exclusion_type,
                              hours: _hours
                           }
                        })
                     }
                  }
               }               
            }
         }
      }
      return await NextResponse.json({status: 'success', data: _calendar});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
