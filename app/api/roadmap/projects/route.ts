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
                        name: true
                     }
                  }
               },
               distinct: ['project_id']
            }
         }
      })
      
      return await NextResponse.json({status: 'success', data: data});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
