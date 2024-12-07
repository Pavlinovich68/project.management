import prisma from "@/prisma/client";
import CalendarHelper from "@/services/calendar.helper";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { year } = await request.json();
      const result = await CalendarHelper.planHoursInYear(year);
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}