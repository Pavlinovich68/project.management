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
            day: i+1,
            background_class: (dayOfWeek === 0 || dayOfWeek === 6)? 'cell-red': 'cell-gray',
            text_class: (dayOfWeek === 0 || dayOfWeek === 6)? 'text-red': 'text-gray',
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

         const filtered = exclusions.filter(elem => elem.date.getMonth() === month).map((i) => {
            let background_class = 'cell-gray';
            let text_class = 'cell-text';
            switch (i.exclusion_type) {
               case 0: {
                  background_class = 'cell-red';
                  text_class = 'cell-text-red';
                  break;
               }
               case 1: {
                  background_class = 'cell-pink';
                  text_class = 'cell-text-pink';
                  break;
               }
            }
            return {               
               day: i.date.getDate(),
               exclusion_type: i.exclusion_type,
               background_class: background_class,
               text_class: text_class,
            }
         });

         for (let i = 0; i < filtered.length; i++) {
            let elem = result.find(elem => elem.day === filtered[i].day);
            if (elem && (elem.exclusion_type !== filtered[i].exclusion_type)) {
               elem.exclusion_type = filtered[i].exclusion_type;
               elem.background_class = filtered[i].background_class;
               elem.text_class = filtered[i].text_class;
            }
         }
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}