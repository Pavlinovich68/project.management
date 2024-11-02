import { IRoadmapItem } from "@/models/IRoadmapItem";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { year } = await request.json();

      const data = await prisma.roadmap.findFirst({
         where: {
            year: year
         },
         select: {
            id: true,
            roadmap_items: {
               select: {
                  id: true,
                  project: {
                     select: {
                        id: true,
                        code: true,
                        name: true
                     }
                  }
               },
               distinct: ['project_id']
            }
         }
      });

      const projectCode = (code: string) => {
         const length = code.length;
         const result = Number(code.substring(1, length));
         return result;
      }

      const result:IRoadmapItem[] | undefined = data?.roadmap_items.map((item) => {
         return {
            roadmap_id: data?.id,
            id: item.id,
            project_id: item.project.id,
            project_code: item.project.code,
            project_name: item.project.name
         }
      }).sort(function(a, b) { return projectCode(a.project_code) - projectCode(b.project_code) })
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
