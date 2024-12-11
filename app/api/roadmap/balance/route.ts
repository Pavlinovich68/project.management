import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper from "@/services/calendar.helper";
import { IRoadmapControlPoint, IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";

export const POST = async (request: NextRequest) => {
   try {
      const { roadmap_id } = await request.json();

      const roadmap = await prisma.roadmap.findUnique({where: {id: roadmap_id}});

      const plan = await prisma.roadmap_item.aggregate({
         where: {
            roadmap_id: roadmap_id
         },
         _sum: {
            hours: true
         }
      });

      const fact = await prisma.roadmap_fact_item.aggregate({
         where: {
            roadmap_item: {
               roadmap_id: roadmap_id
            }
         },
         _sum: {
            hours: true
         }
      })

      const rateCount = (await prisma.rate.aggregate({
         where: {
            division_id: roadmap_id?.division_id,
            is_work_time: true
         },
         _count: true
      }))?._count;

      const total = await CalendarHelper.workingHoursBetweenDates(new Date(roadmap?.year??0, 0, 1), new Date(roadmap?.year??0, 11, 31))
      const ratio = await CalendarHelper.timeRatio(roadmap?.year??0);

      /*
      Показываем: 
         Невостребованные планом часы
         Отставание факта от плана в %
      */

      return await NextResponse.json({status: 'success', data: {plan: plan._sum.hours, fact: fact._sum.hours, total: total * rateCount, ratio: ratio}});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
