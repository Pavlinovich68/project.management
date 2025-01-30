import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   const { id } = await request.json();
   try {
      let result = undefined;
      const fact = await prisma.roadmap_fact_item.aggregate({
         where: {
            roadmap_item_id: id
         },
         _sum: {
            hours: true
         }
      });
      const factHours = fact._sum.hours??undefined;
      if (factHours) {
         result = await prisma.roadmap_item.update({
            where: {
               id: id
            },
            data: {
               hours: factHours,
               is_closed: true
            }
         });
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}