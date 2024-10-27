import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

      let result: any = []
      for(const item of data) {
         const dates = dateArray(item.start_date, item.end_date);
         //@ts-ignore
         result.push[dates];
      }
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
