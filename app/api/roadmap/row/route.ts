import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import DateHelper from "@/services/date.helpers";
import { IRoadmapItemSegment } from "@/models/IRoadmapItemSegment";
import { Extensions } from "@prisma/client/runtime/library";

const palette = [
   "#0f2d5c",
   "#143d79",
   "#1b4b91",
   "#255ab2",
   "#316dca",
   "#4184e4",
   "#539bf5",
   "#6cb6ff",
   "#96d0ff",
   "#c6e6ff"
];

const BASE_COLOR = "#e0e4ea"

function* getSegmentNextColor() {
   let i = 0;
   while (true) {
      yield palette[i];
      i = (i + 1) % palette.length;
   }
}

export const POST = async (request: NextRequest) => {
   try {
      const { roadmap_id, project_id } = await request.json();

      const records = await prisma.roadmap_item.findMany({
         where: {
            roadmap_id: roadmap_id,
            project_id: project_id
         },
         select: {            
            id: true,
            comment: true,
            start_date: true,
            end_date: true,
            roadmap: true
         },
         orderBy: {
            start_date: 'asc'
         }
      });

      //return await NextResponse.json({status: 'success', data: records});

      if (!records) {
         throw Error('Дорожная карта не содержит проектов!');
      }

      const year = records[0]?.roadmap.year;

      let colorIt = getSegmentNextColor();
      let data:IRoadmapItemSegment[] = records.map((item) => {
         return {
            id: item.id,
            name: item.comment,
            start: DateHelper.dayNumber(item.start_date),
            end: DateHelper.dayNumber(item.end_date),
            value: undefined,
            type: 1,
            percent: undefined,
            color: colorIt.next().value??''
         }
      }).sort(function(a, b) {
         //@ts-ignore
         return a.start_date - b.start_date
      })

      const passArray = [];
      // добавляем пропуск перед сегментом
      if (data[0].start > 1) {
         passArray.push({
            id: -1,
            name: '',
            start: 1,
            end: data[0].start - 1,
            value: undefined,
            type: 0,
            percent: undefined,
            color: BASE_COLOR
         })
      }
      // после каждого сегмента добавляем пропуск      
      if (data.length > 1) {
         let index = 0;
         for (const item of data) {
            if (data.length-1 > index) {
               passArray.push({
                  id: -1,
                  name: '',
                  start: item.end + 1,
                  end: data[index+1].start - 1,
                  value: undefined,
                  type: 0,
                  percent: undefined,
                  color: BASE_COLOR
               })
               index++;
            }
         }
      }
      // если дата окончания последнего сегмента не последний день года то добавляем сегмент в конце;
      const dayCount = DateHelper.dayNumber(new Date(year+1, 0, 0));
      const lastSegment = data[data.length-1];
      if (lastSegment.end < dayCount) {
         passArray.push({
            id: -1,
            name: '',
            start: lastSegment.end + 1,
            end: dayCount,
            value: undefined,
            type: 0,
            percent: undefined,
            color: BASE_COLOR
         })
      }

      data = data.concat(passArray);

      const result = data.map((i) => { 
         i.value = i.end - i.start + 1;
         i.percent = i.value / dayCount * 100;
         return i;
      }).sort(function(a, b) {
         //@ts-ignore
         return a.start - b.start
      });

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
