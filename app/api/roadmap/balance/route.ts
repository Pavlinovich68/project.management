import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper from "@/services/calendar.helper";
import { IRoadmapControlPoint, IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";

export const POST = async (request: NextRequest) => {
   try {
      const { year, division_id } = await request.json();

      const plan = await prisma.roadmap_item.aggregate({
         where: {
            roadmap: {
               year: year
            }
         },
         _sum: {
            hours: true
         }
      });

      const fact = await prisma.roadmap_fact_item.aggregate({
         where: {
            roadmap_item: {
               roadmap: {
                  year: year
               }
            }
         },
         _sum: {
            hours: true
         }
      })

      const rateCount = (await prisma.rate.aggregate({
         where: {
            division_id: division_id,
            is_work_time: true
         },
         _count: true
      }))?._count;

      const total = await CalendarHelper.workingHoursBetweenDates(new Date(year, 0, 1), new Date(year, 11, 31))
      const available = await CalendarHelper.timeAvailable(year);
      const lack = await CalendarHelper.vacancyHours(division_id, year);

      return await NextResponse.json({status: 'success', data: {
         plan: plan._sum.hours??0, 
         fact: fact._sum.hours??0, 
         total: (total * rateCount) -224, 
         available: available * rateCount,
         lack: lack
      }});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
