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
      const staffs = await prisma.rate.findMany({
         where: { division_id }
      })

      //const _daysCount = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      return await NextResponse.json({status: 'success', data: _calendar});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
