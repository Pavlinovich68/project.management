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

      const result:IRoadmapItem[] | undefined = data?.roadmap_items.map((item) => {
         return {
            id: item.id,
            project_id: item.project.id,
            project_code: item.project.code,
            project_name: item.project.name
         }
      })
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
