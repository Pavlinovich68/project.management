import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
// 0 - holiday
// 1 - reduced
// 2 - holiday transfer
// 3 - worked transfer
// 4 - worked
// 5 - vacation
// 6 - hospital
// 7 - without pay
// 8 - absense from work
// 9 - vacancy
// 10 - work on weekends
   try {
      let hours:number = 0;
      const { id, type } = await request.json();
      switch (type) {
         case 1: {
            hours = 7;
            break;
         }
         case 3: {
            hours = 8;
            break;
         }
         case 4: {
            hours = 8;
            break;
         }
         case 10: {
            hours = 8;
            break;
         }
      }
      const result = await prisma.dept_calendar_cell.update({
         where: {
            id: id
         },
         data: {
            type: type,
            hours: hours
         }
      })
      return await NextResponse.json({status: 'success', data: result});      
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}