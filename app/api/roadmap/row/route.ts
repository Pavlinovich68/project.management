import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import DateHelper from "@/services/date.helpers";
import { IRoadmapItemSegment, IRoadmapFactItemSegment, IControlPoint } from "@/models/IRoadmapItemSegment";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import CalendarHelper from "@/services/calendar.helper";

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
            is_closed: true
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
      const totalHours: number = (await CalendarHelper.workingHoursOnDate(new Date(record?.roadmap.year??new Date().getFullYear(), 11, 31)) - 28) * rateCount;
      
      // Контрольные точки по проекту      
      const item_points: IControlPoint[] = record?.control_points.map((i) => {
         return {
            id: i.id,
            item_id: i.roadmap_item_id,
            name: i.name,
            date: i.date,
            value: 0,
            type: i.type
         }
      }).sort(function(a, b) {
         return a.type - b.type
      })??[];

      for (const item_point of item_points) {
         const hours = await CalendarHelper.workingHoursOnDate(item_point.date);
         item_point.value = (hours * rateCount) / totalHours * 100;
      }
      
      const baseItem: IRoadmapItemCRUD = {
         id: record?.id??0,
         comment: record?.comment??'',
         project_id: record?.project_id??0,
         project_name: record?.project.name,
         roadmap_id: record?.roadmap_id??0,
         hours: record?.hours??0,
         control_points: item_points,
         is_closed: record?.is_closed??false
      };
      return await NextResponse.json({status: 'success', data: baseItem});
      // let data:IRoadmapItemSegment[] = records.map((item) => {
      //    return {
      //       id: item.id,
      //       name: item.comment,
      //       start: DateHelper.dayNumber(item.start_date),
      //       end: DateHelper.dayNumber(item.end_date),
      //       value: undefined,
      //       type: 1,
      //       percent: undefined,
      //       hours: item.hours,
      //       fact: undefined,
      //       points: undefined
      //    }
      // }).sort(function(a, b) {
      //    return a.start - b.start
      // })     

      // const passArray:IRoadmapItemSegment[] = [];
      // // добавляем пропуск перед сегментом
      // if (data[0].start > 1) {
      //    passArray.push({
      //       id: -1,
      //       name: '',
      //       start: 1,
      //       end: data[0].start - 1,
      //       value: undefined,
      //       type: 0,
      //       percent: undefined,
      //       hours: 0,
      //       fact: undefined
      //    })
      // }
      // // после каждого сегмента добавляем пропуск      
      // if (data.length > 1) {
      //    let index = 0;
      //    for (const item of data) {
      //       if (data.length-1 > index) {
      //          passArray.push({
      //             id: -1,
      //             name: '',
      //             start: item.end + 1,
      //             end: data[index+1].start - 1,
      //             value: undefined,
      //             type: 0,
      //             percent: undefined,
      //             hours: 0,
      //             fact: undefined
      //          })
      //          index++;
      //       }
      //    }
      // }
      // // если дата окончания последнего сегмента не последний день года то добавляем сегмент в конце;
      // const dayCount = DateHelper.dayNumber(new Date(year+1, 0, 0));
      // const lastSegment = data[data.length-1];
      // if (lastSegment.end < dayCount) {
      //    passArray.push({
      //       id: -1,
      //       name: '',
      //       start: lastSegment.end + 1,
      //       end: dayCount,
      //       value: undefined,
      //       type: 0,
      //       percent: undefined,
      //       hours: 0,
      //       fact: undefined
      //    })
      // }

      // data = data.concat(passArray);

      // const result = data.map((i) => { 
      //    i.value = i.end - i.start + 1;
      //    i.percent = i.value / dayCount * 100;
      //    return i;
      // }).sort(function(a, b) {
      //    return a.start - b.start
      // });

      
      // for (const item of result) {
      //    if (item.type === 1) {
      //       const fact = await prisma.roadmap_fact_item.aggregate({
      //          where: {
      //             roadmap_item_id: item.id
      //          },
      //          _sum: {
      //             hours: true
      //          }
      //       });
      //       const factSum = fact._sum.hours??undefined;
      //       item.fact = {
      //          hours: factSum,
      //          percent: (factSum && item.hours) ? factSum / item.hours * 100 : undefined
      //       }
      //    }         
      // }

      // return await NextResponse.json({status: 'success', data: {
      //    segments: result,
      //    points: points,
      //    items: baseItems
      // }});

      

      // Данные по элементу дорожной карты
      // const record = await prisma.roadmap_item.findFirst({
      //    where: {
      //       roadmap_id: roadmap_id,
      //       project_id: project_id
      //    },
      //    select: {            
      //       id: true,
      //       comment: true,
      //       hours: true,
      //       roadmap: true,
      //       control_points: true,
      //       roadmap_id: true,
      //       project_id: true,
      //       project: true,
      //       is_closed: true
      //    }
      // });

      // const rateCount = await prisma.rate.aggregate({
      //    where: {
      //       division_id: roadmap_id?.division_id,
      //       is_work_time: true
      //    },
      //    _count: true
      // });

      // const totalHours = await CalendarHelper.workingHoursOnDate(new Date(record?.roadmap.year??new Date().getFullYear(), 11, 31)) * rateCount._count;
      // const points:IControlPoint[] = [];
      // const baseItems: IRoadmapItemCRUD[] = [];

      // const item_points = record?.control_points.map((i) => {
      //    return {
      //       id: i.id,
      //       item_id: i.roadmap_item_id,
      //       name: i.name,
      //       date: i.date,
      //       value: 0,
      //       type: i.type
      //    }
      // }).sort(function(a, b) {
      //    return a.type - b.type
      // });

      // if (item_points)
      //    for(const item of item_points){
      //       item.value = (await CalendarHelper.workingHoursOnDate(item.date) * rateCount._count) / totalHours * 100;
      //    }

      // let data:IRoadmapItemSegment[] = records.map((item) => {
      //    const item_points = item.control_points.map((i) => {
      //       return {
      //          id: i.id,
      //          item_id: i.roadmap_item_id,
      //          name: i.name,
      //          date: i.date,
      //          value: DateHelper.dayNumber(i.date) / daysOfYear * 100,
      //          type: i.type
      //       }
      //    }).sort(function(a, b) {
      //       return a.type - b.type
      //    });
      //    //---------- 
      //    item.control_points.map((i) => {
      //       points.push({
      //          id: i.id,
      //          item_id: i.roadmap_item_id,
      //          name: i.name,
      //          date: i.date,
      //          value: DateHelper.dayNumber(i.date) / daysOfYear * 100,
      //          type: i.type
      //       })
      //    }); 
      //    //-----------
      //    baseItems.push({
      //       id: item.id,
      //       comment: item.comment??'',
      //       project_id: item.project_id,
      //       project_name: item.project.name,
      //       roadmap_id: item.roadmap_id,
      //       start_date: item.start_date,
      //       end_date:   item.end_date,
      //       hours: item.hours,
      //       developer_qnty: item.developer_qnty,
      //       control_points: item_points,
      //       is_closed: item.is_closed
      //    })
      //    //--------
      //    return {
      //       id: item.id,
      //       name: item.comment,
      //       start: DateHelper.dayNumber(item.start_date),
      //       end: DateHelper.dayNumber(item.end_date),
      //       value: undefined,
      //       type: 1,
      //       percent: undefined,
      //       hours: item.hours,
      //       fact: undefined,
      //       points: undefined
      //    }
      // }).sort(function(a, b) {
      //    return a.start - b.start
      // })

      return await NextResponse.json({status: 'success', data: 0});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
