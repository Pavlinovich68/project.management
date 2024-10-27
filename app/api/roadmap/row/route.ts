import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import DateHelper from "@/services/date.helpers";

export const POST = async (request: NextRequest) => {
   interface IDataRecord {
      id: number,
      start_date: Date,
      end_date: Date,
      project: {
         id: number,
         code: string,
         name: string
      }
   }

   try {
      const { year, roadmap_id, project_id } = await request.json();

      const dateArray = (start: Date, end: Date) => {
         const result = [];
         while(start <= end) {
            result.push(new Date(start));
            start.setDate(start.getDate() + 1);
         }
         return result;
      }

      const data: IDataRecord[] = await prisma.roadmap_item.findMany({
         where: {
            roadmap_id: roadmap_id,
            project_id: project_id
         },
         select: {
            id: true,
            start_date: true,
            end_date: true,
            project: {
               select: {
                  id: true,
                  code: true,
                  name: true
               }
            }
         },
         orderBy: {
            start_date: 'asc'
         }
      });

      let result: Boolean[] = [];
      const max_date = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      
      for (const item of data) {         
         let index = 1;
         let date = new Date(year, 0, 1);
         const startDate = new Date(DateHelper.currentLocaleDate(item.start_date));
         const endDate = new Date(DateHelper.currentLocaleDate(item.end_date));
         while(index <= max_date) {
            const isOk = date >= startDate && date <= endDate;             
            result.push(isOk);
            date = new Date(date.getTime() + (1000 * 60 * 60 * 24));
            index++;
         }
      }
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
