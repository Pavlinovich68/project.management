import { IRoadmapItem } from "@/models/IRoadmapItem";
import prisma from "@/prisma/client";
import CalendarHelper from "@/services/calendar.helper";
import DateHelper from "@/services/date.helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { begin_date, count } = await request.json();

      const result = CalendarHelper.getEndDate(new Date(begin_date), count);

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
