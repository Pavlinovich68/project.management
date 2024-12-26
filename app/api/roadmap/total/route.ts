import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper, { IDateHours } from "@/services/calendar.helper";
import _logger from "next-auth/utils/logger";
import { IRoadmapDataItem } from "@/models/IRoadmapData";

export const POST = async (request: NextRequest) => {
   try {
      const { year, division_id } = await request.json();

      //NOTE - [{Дата, количество рабочих часов}] по штатному расписанию
      const dateHours:IDateHours[] = [];
      let currentDate = new Date(year, 0, 1);
      const last = new Date(year, 11, 31);
      while (currentDate <= last) {
         const hours = await CalendarHelper.getDivisionHoursOfDate(division_id, currentDate);
         const day = currentDate.getDate();
         const month = currentDate.getMonth();
         dateHours.push({date: new Date(year, month, day), hours: hours});
         currentDate.setDate(currentDate.getDate() +1);
      }

      const items = await prisma.roadmap_item.findMany({
         where: {
            roadmap: {
               year: year,
               division_id: division_id
            }
         },
         select: {        
            id: true,    
            comment: true,
            hours: true,
            begin_date: true,
            project: true
         }
      });

      if (!items) return undefined;

      const totalHours = dateHours.map(i => i.hours).reduce((accumulator, currentValue) => {return accumulator + currentValue}, 0);
      
      const scale = [];
      let acc: number = 0;
      for(let i = 0; i < 12; i++) {
         const monthHours = dateHours.filter((j) => j.date.getMonth() === i)
            .map((j) => j.hours)
            .reduce((accumulator, hours) => {return accumulator + hours}, 0);      
         scale.push({month: i, value: monthHours, left: acc / totalHours * 100, length: monthHours / totalHours * 100});
         acc += monthHours;
      }
      
      const result = [];
      for (const item of items) {
         const left = dateHours.filter((i) => i.date >= new Date(year, 0, 1) && i.date <= item.begin_date)
            .map(i => i.hours)
            .reduce((accumulator, currentValue) => {return accumulator + currentValue}, 0) / totalHours * 100;

         let end_date = item.begin_date;
         let _hours = item.hours;
         for (const _date of dateHours) {
            end_date = _date.date;
            if (_date.date >= item.begin_date) {               
               _hours -= _date.hours;
            }
            if (_hours <= 0) break;
         }

         const _item: IRoadmapDataItem = {
            project_code: item.project.code,
            project_name: item.project.name,
            comment: item.comment,
            begin_date: item.begin_date,
            hours: item.hours,
            left: left,
            length: item.hours / totalHours * 100,
            end_date: end_date
         }
         result.push(_item);
      }

      return await NextResponse.json({status: 'success', hours: totalHours, scale: scale, data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
