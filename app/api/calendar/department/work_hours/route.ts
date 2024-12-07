import prisma from "@/prisma/client";
import CalendarHelper from "@/services/calendar.helper";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { year, division_id } = await request.json();
      const house = await CalendarHelper.planHoursInYear(year);
      const rateCount = await prisma.rate.aggregate({
         where: {
            division_id: division_id,
            is_work_time: true
         },
         _count: true
      })
      const result: number = await CalendarHelper.planHoursInYear(year) * rateCount._count;
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}