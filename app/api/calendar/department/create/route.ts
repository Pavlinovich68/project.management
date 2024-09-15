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
            _workerName = _worker.employee.surname + ' ' + _worker.employee.name.charAt(0) + '.'
         }
         

         const _row = await prisma.dept_calendar_row.create({
            data: {
               calendar_id: _calendar.id,
               rate_id: rate.id,
               header: ''
            }
         });
         let _i = 0;
         while (_i < _daysCount) {
            _i++
            let _date = new Date(Date.UTC(year, 0, _i))
            const _dayOfWeek = _date.getDay();
            const _isHoliday = (_dayOfWeek === 0 || _dayOfWeek === 6);
         }
      }

      return await NextResponse.json({status: 'success', data: _calendar});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
