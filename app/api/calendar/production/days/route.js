import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   try {
      const { profile_id, year, month } = await request.json();      

      const cnt = new Date(year, month+1, 0).getDate();
      const days = Array.from(Array(cnt).keys());
      const result = [];
      // Заполняю выходными
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

      // Заполняю из исключений
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

         if (profile_id) {
            const vacations = await prisma.$queryRaw`
               select
                  v.start_date,
                  v.end_date
               from
                  vacation v
                  left join profile p on v.profile_id = p.id
               where
                  v.year = ${year}
                  and (extract(month from v.start_date) = ${month+1} or extract(month from v.end_date) = ${month+1})
                  and v.profile_id = ${profile_id}
               order by
                  v.start_date  
            `;

            for (let i = 0; i < vacations.length; i++) {
               for (let j = 0; j < result.length; j++) {
                  const date = new Date(Date.UTC(year, month, j+1));
                  if (date >= vacations[i].start_date && date <= vacations[i].end_date) {
                     result[j].background_class = 'cell-yellow';
                     result[j].exclusion_type = 4;
                  }
               }
            }
         }
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}