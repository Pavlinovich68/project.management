import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper from "@/services/calendar.helper";
import { IDashboardControlPoint, IDashboardProjectItem } from "@/models/IDashboardProjectItem";
import minioClient from "@/lib/minio-client";

export const POST = async (request: NextRequest) => {
   try {
      const { division_id, year } = await request.json();

      const sourceFile = 'd:/Temp/Список систем по ГК.xlsx';
      const bucket = 'project-management';
      const destinationObject = 'Список систем по ГК.xlsx'

      const exists = await minioClient.bucketExists(bucket)
      if (exists) {
      console.log('Bucket ' + bucket + ' exists.')
      } else {
      await minioClient.makeBucket(bucket, 'project-management')
      console.log('Bucket ' + bucket + ' created in "project-management".')
      }

      // Set the object metadata
      var metaData = {
         'Content-Type': 'text/plain',
         'X-Amz-Meta-Testing': 1234,
         example: 5678,
      }

      // Upload the file with fPutObject
      // If an object with the same name exists,
      // it is updated with new data
      await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
      console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)


      await NextResponse.json({status: 'success', data: []});

      // Дорожная карта по проекту
      const dashboard = await prisma.roadmap.findFirst({
         where: {
            year: year,
            division_id: division_id
         }
      });      

      if (!dashboard) return await NextResponse.json({status: 'success', data: []});

      // Выбираем проекты в работе
      let records = await prisma.roadmap_item.findMany({
         where: {
            roadmap_id: dashboard.id
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
         },
         orderBy: {
            project: {
               code: 'asc'
            }
         }
      });     

      if (!records)  return await NextResponse.json({status: 'success', data: []});
      records = records.map(rec => {return {...rec, begin_date: rec.control_points.find(cp => cp.type === 0)?.date}});      

      // Начинаем обогощать
      
      // Количество ставок в подразделении
      const rateCount = (await prisma.rate.aggregate({
         where: {
            division_id: dashboard?.division_id,
            is_work_time: true
         },
         _count: true
      }))?._count;
      
      // Количество плановых рабочих часов по подразделению с вычетом отпускных (отпускные без привязки к конкретному графику отпусков)
      const totalHours: number = (await CalendarHelper.workingHoursBetweenDates(new Date(year, 0, 1), new Date(year, 11, 31)) - 224) * rateCount;      

      const result: IDashboardProjectItem[] = [];
      for(const record of records) {
         // Контрольные точки по проекту      
         const item_points: IDashboardControlPoint[] = record?.control_points.map((i) => {
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
            const hours = await CalendarHelper.workingHoursBetweenDates(new Date(record.roadmap.year, 0, 1), item_point.date);
            item_point.width = hours * rateCount / totalHours * 100;
         }

         const start_width = (await CalendarHelper.workingHoursBetweenDates(new Date(record.roadmap.year, 0, 1), 
            //@ts-ignore
            record.begin_date
         ) * rateCount) / totalHours * 100;

         const fact = (await prisma.roadmap_fact_item.aggregate({
            where: {
               roadmap_item_id: record.id
            },
            _sum: {
               hours: true
            }
         }))._sum.hours;

         const resuItitem: IDashboardProjectItem = {
            dashboard_id: record.roadmap_id,         
            dashboard_item_id: record.id,   
            comment: record.comment??'',
            project_code: record.project.code,
            project_name: record.project.name,
            hours: record.hours,
            start_width: start_width,
            plan_width: record.hours / totalHours * 100,
            fact_hours: fact,
            fact_width: (fact??0) / totalHours * 100,
            control_points: item_points,         
            is_closed: record.is_closed,
            percentage: Math.floor(((fact??0) / record.hours * 100) * 100) / 100
         }
         
         result.push(resuItitem);
      }      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
