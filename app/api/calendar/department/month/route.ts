import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { employee_id, year, month } = await request.json();

      const _staff = await prisma.staff.findFirst({where: {employee_id: employee_id}});
      if (!_staff) throw new Error('Не найдена штатная еденица связанная с сотрудником');

      const _rate = await prisma.rate.findFirst({where: {id: _staff.rate_id}});
      if (!_rate) throw new Error('Не найдена ставка');

      const _calendar = await prisma.dept_calendar.findFirst({
         where: {
            division_id: _rate.division_id,
            year: year
         }
      });

      const _cells = await prisma.dept_calendar_cell.findMany({
         where: {
            row: {
               rate_id: _rate.id,
               calendar_id: _calendar?.id,               
            },            
            month: month 
         },
         orderBy: {
            day: 'asc'
         }
      })

      const firstDate: Date = new Date(year, month-1, 1);
      const firstDay: number = firstDate.getDay();
      let _day = new Date(year, month-1, 0).getDate();
      let counter: number = firstDay === 0 ? 6 : firstDay -1;

      while (counter > 0) {
         _cells.unshift({ type: 100, day: _day } as any);
         _day--;
         counter--;
      }

      const lastDay = new Date(year, month, 0).getDay();
      counter = lastDay === 0 ? 0 : 7 - lastDay;
      _day = 1;
      for (let index = 0; index < counter; index++){
         _cells.push({ type: 100, day: _day} as any);
         _day++;
      }
      
      return await NextResponse.json({status: 'success', data: _cells});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
