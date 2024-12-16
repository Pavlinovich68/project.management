import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper, { IDateHours } from "@/services/calendar.helper";
import _logger from "next-auth/utils/logger";
import { IRoadmapDataItem } from "@/models/IRoadmapData";

export const POST = async (request: NextRequest) => {
   try {
      const { year, division_id } = await request.json();

      const dateHours = [];
      let currentDate = new Date(year, 0, 1);
      const last = new Date(year, 11, 31);
      while (currentDate <= last) {
         const hours = await CalendarHelper.getDivisionHoursOfDate(division_id, currentDate);
         const day = currentDate.getDate();
         const month = currentDate.getMonth();
         dateHours.push({date: new Date(year, month, day), hours: hours});
         currentDate.setDate(currentDate.getDate() +1);
      }

      return await NextResponse.json({status: 'success', data: dateHours});

      const items = await prisma.roadmap_item.findMany({
         where: {
            roadmap: {
               year: year,
               division_id: division_id
            }
         },
         select: {        
            id: true,    
            comment: true,
            hours: true,
            begin_date: true,
            project: true
         }
      });

      if (!items) return undefined;

      const totalHours = await CalendarHelper.getDivisionHoursBetweenDates(division_id, new Date(year, 0, 1), new Date(year, 11, 31));
      
      const result = [];
      for (const item of items) {
         const left = await CalendarHelper.getDivisionHoursBetweenDates(division_id, new Date(year, 0, 1), item.begin_date) / totalHours * 100;

         const _item: IRoadmapDataItem = {
            project_code: item.project.code,
            project_name: item.project.name,
            comment: item.comment,
            begin_date: item.begin_date,
            hours: item.hours,
            left: left,
            length: item.hours / totalHours * 100
         }
         result.push(_item);
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
