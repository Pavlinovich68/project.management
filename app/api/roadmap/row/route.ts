import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper from "@/services/calendar.helper";
import { IRoadmapControlPoint, IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";

export const POST = async (request: NextRequest) => {
   try {
      const { roadmap_id, project_id } = await request.json();

      const record = await prisma.roadmap_item.findFirst({
         where: {
            roadmap_id: roadmap_id,
            project_id: project_id
         },
         select: {            
            id: true,
            comment: true,
            hours: true,
            roadmap: true,
            control_points: true,
            roadmap_id: true,
            project_id: true,
            project: true,
            is_closed: true,
            begin_date: true
         }
      });

      if (!record) return undefined;
      
      // Количество ставок в подразделении
      const rateCount = (await prisma.rate.aggregate({
         where: {
            division_id: roadmap_id?.division_id,
            is_work_time: true
         },
         _count: true
      }))?._count;
      
      // Количество плановых рабочих часов по подразделению с вычетом отпускных (отпускные без привязки к конкретному графику отпусков)
      const totalHours: number = (await CalendarHelper.workingHoursOnDate(new Date(record?.roadmap.year??new Date().getFullYear(), 11, 31)) - 224) * rateCount;      
      // Контрольные точки по проекту      
      const item_points: IRoadmapControlPoint[] = record?.control_points.map((i) => {
         return {
            id: i.id,
            name: i.name,
            date: i.date,
            width: undefined,
            type: i.type
         }
      }).sort(function(a, b) {
         return a.type - b.type
      })??[];

      for (const item_point of item_points) {
         const hours = await CalendarHelper.workingHoursOnDate(item_point.date);
         item_point.width = hours * rateCount / totalHours * 100;
      }

      let start_width = 0;
      if (record.begin_date) {         
         start_width = (await CalendarHelper.workingHoursOnDate(record.begin_date) * rateCount) / totalHours * 100;
      }

      const fact = (await prisma.roadmap_fact_item.aggregate({
         where: {
            roadmap_item_id: record.id
         },
         _sum: {
            hours: true
         }
      }))._sum.hours;

      const result: IRoadmapProjectItem = {
         roadmap_id: record.roadmap_id,         
         roadmap_item_id: record.id,   
         comment: record.comment,
         project_code: record.project.code,
         project_name: record.project.name,
         hours: record.hours,
         start_width: start_width,
         plan_width: record.hours / totalHours * 100,
         fact_hours: fact??0 / totalHours * 100,
         fact_width: undefined,
         control_points: item_points
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
