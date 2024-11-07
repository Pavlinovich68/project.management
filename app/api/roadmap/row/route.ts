import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import DateHelper from "@/services/date.helpers";
import { IRoadmapItemSegment, IRoadmapFactItemSegment } from "@/models/IRoadmapItemSegment";
import { Extensions } from "@prisma/client/runtime/library";

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
            hours: true,
            roadmap: true,
            control_points: true
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

      const daysOfYear = new Date(year, 2, 0).getDate() === 29 ? 366 : 265;

      let data:IRoadmapItemSegment[] = records.map((item) => {
         const points = item.control_points.map((i) => {
            return {
               name: i.name,
               date: i.date,
               value: DateHelper.dayNumber(i.date) / daysOfYear * 100
            }
         });
         return {
            id: item.id,
            name: item.comment,
            start: DateHelper.dayNumber(item.start_date),
            end: DateHelper.dayNumber(item.end_date),
            value: undefined,
            type: 1,
            percent: undefined,
            hours: item.hours,
            fact: undefined,
            points: points
         }
      }).sort(function(a, b) {
         return a.start - b.start
      })     

      const passArray:IRoadmapItemSegment[] = [];
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
            hours: 0,
            fact: undefined,
            points: undefined
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
                  hours: 0,
                  fact: undefined,
                  points: undefined
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
            hours: 0,
            fact: undefined,
            points: undefined
         })
      }

      data = data.concat(passArray);

      const result = data.map((i) => { 
         i.value = i.end - i.start + 1;
         i.percent = i.value / dayCount * 100;
         return i;
      }).sort(function(a, b) {
         return a.start - b.start
      });

      for (const item of result) {
         if (item.type === 1) {
            const fact = await prisma.roadmap_fact_item.aggregate({
               where: {
                  roadmap_item_id: item.id
               },
               _sum: {
                  hours: true
               }
            });
            const factSum = fact._sum.hours??undefined;
            item.fact = {
               hours: factSum,
               percent: (factSum && item.hours) ? factSum / item.hours * 100 : undefined
            }
         }         
      }

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
