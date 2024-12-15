import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper from "@/services/calendar.helper";
import { IRoadmapControlPoint, IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";
import _logger from "next-auth/utils/logger";

export interface dateHours {
   date: Date,
   hours: number
}

export const POST = async (request: NextRequest) => {
   try {
      const { year, division_id } = await request.json();

      const items = await prisma.roadmap_item.findMany({
         where: {
            roadmap: {
               year: year,
               division_id: division_id
            }
         },
         select: {            
            comment: true,
            hours: true,
            begin_date: true
         }
      });

      if (!items) return undefined;

      const totalHours = await CalendarHelper.getDivisionHoursBetweenDates(division_id, new Date(year, 0, 1), new Date(year, 11, 31));
      

      // Количество ставок в подразделении
      const rateCount = (await prisma.rate.aggregate({
         where: {
            division_id: division_id,
            is_work_time: true
         },
         _count: true
      }))?._count;
      
      // Количество плановых рабочих часов по подразделению с вычетом отпускных (отпускные без привязки к конкретному графику отпусков)
      //const totalHours: number = (await CalendarHelper.workingHoursBetweenDates(new Date(year, 0, 1), new Date(year, 11, 31))) * rateCount  - 224;
      
      //const start_width = (await CalendarHelper.workingHoursBetweenDates(new Date(year, 0, 1), record.begin_date) * rateCount) / totalHours * 100;
      
      const result = [];
      for (const item of items) {
         const _start = (await CalendarHelper.workingHoursBetweenDates(new Date(year, 0, 1), item.begin_date) * rateCount) / totalHours * 100;

         const fact = (await prisma.roadmap_fact_item.aggregate({
            where: {
               roadmap_item_id: item.id
            },
            _sum: {
               hours: true
            }
         }))._sum.hours;

         const _item = {
            code: item.project.code,
            name: item.project.name,
            hours: item.hours,
            start: _start,
            end: (fact??0) / totalHours * 100
         }
         result.push(_item);
      }

      // const fact = (await prisma.roadmap_fact_item.aggregate({
      //    where: {
      //       roadmap_item_id: record.id
      //    },
      //    _sum: {
      //       hours: true
      //    }
      // }))._sum.hours;

      // const result: IRoadmapProjectItem = {
      //    roadmap_id: record.roadmap_id,         
      //    roadmap_item_id: record.id,   
      //    comment: record.comment??'',
      //    project_code: record.project.code,
      //    project_name: record.project.name,
      //    hours: record.hours,
      //    start_width: start_width,
      //    plan_width: record.hours / totalHours * 100,
      //    fact_hours: fact,
      //    fact_width: (fact??0) / totalHours * 100,
      //    control_points: item_points,         
      //    is_closed: record.is_closed,
      //    percentage: Math.floor(((fact??0) / record.hours * 100) * 100) / 100
      // }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
