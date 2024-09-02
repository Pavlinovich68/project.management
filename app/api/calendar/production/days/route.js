import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request) => {
   try {
      const url = new URL(request.url);
      const year = Number(url.searchParams.get("year"));
      const month = Number(url.searchParams.get("month"));

      const cnt = new Date(year, month+1, 0).getDate();
      const days = Array.from(Array(cnt).keys());
      const result = [];
      for (let i = 0; i < days.length; i++) {
         const date = new Date(Date.UTC(year, month, i+1))
         const dayOfWeek = date.getDay();
         result.push({
            date: date,
            exclusion_type: (dayOfWeek === 0 || dayOfWeek === 6)? 0 : -1
         })
      }

      const calendar = await prisma.production_calendar.findFirst({
         where: {
            year: year
         }
      });

      if (calendar) {
         const exclusions = await prisma.exclusion.findMany({
            where:{
               production_calendar_id: calendar.id
            }
         });
         for (let i = 0; i < exclusions.length; i++) {
            let elem = result.find(elem => elem.date.getTime() === exclusions[i].date.getTime());
            if (elem && (elem.exclusion_type !== exclusions[i].exclusion_type)) {
               elem.exclusion_type = exclusions[i].exclusion_type;
            }
         }
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}