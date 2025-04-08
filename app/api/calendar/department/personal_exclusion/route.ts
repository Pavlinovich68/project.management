import { IPersonalExclusion } from "@/models/IPersonalExclusion";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   const data = await request.json();
   let result = false;
   try {
      for (const cell of data.cells) {
         const item = await prisma.personal_exclusion.findFirst({
            where: {
               year: cell.year,
               month: cell.month,
               day: cell.day,
               rate_id: cell.rate_id
            }
         });

         if (item) {
            await prisma.personal_exclusion.update({
               where: {
                  id: item.id
               },
               data: {
                  type: cell.type
               }
            })
         } else {
            await prisma.personal_exclusion.create({
               data: {
                  year: cell.year,
                  month: cell.month,
                  day: cell.day,
                  rate_id: cell.rate_id,
                  type: cell.type   
               }
            })
         }
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}