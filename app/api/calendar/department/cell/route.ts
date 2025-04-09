import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import { ICalendarCell } from "@/models/ICalendar";

export const POST = async (request: NextRequest) => {
   const { year, month, day } = await request.json();
   try {
      const date = new Date(year, month-1, day);
      const exclusionsQuery = await prisma.production_calendar.findFirst({
         where: {
            year: year
         },
         select: {
            exclusions: {
               where: {
                  date: date
               }
            }
         }
      });

      let result: ICalendarCell | undefined = undefined;
      if (exclusionsQuery?.exclusions && exclusionsQuery.exclusions.length > 0) {
         let hours = 0;
         switch (exclusionsQuery?.exclusions[0].exclusion_type) {
            case 1: hours = 7; break;
            case 3: hours = 8; break;
            case 10: hours = 8; break;
         }
         result = {day: day, type: exclusionsQuery?.exclusions[0].exclusion_type, hours: hours, checked: false};         
      } else {
         const dayOfWeek = new Date(year, month -1, day).getDay();
         result = {day: day, type: (dayOfWeek === 6 || dayOfWeek === 0) ? 0 : 4, hours: (dayOfWeek === 6 || dayOfWeek === 0) ? 0 : 8, checked: false}
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}