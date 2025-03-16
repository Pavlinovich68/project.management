import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const params: { year: number, month: number, day: number, user_id: number } = await request.json();
      const date = new Date(params.year, params.month -1, params.day)
      
      const user = await prisma.users.findUnique({where: {id: params.user_id}});
      if (!user)
         throw Error("Не удалось найти пользователя");

      const rows = await prisma.roadmap.findMany({
         include: {
            roadmap_items: {
               include: {
                  fact_items: {
                     where: {
                        employee_id: user.employee_id,
                        month: params.month,
                        day: params.day
                     }
                  }
               }
            }
         },
         where: {
            year: params.year
         }
      })

      return await NextResponse.json({status: 'success', data: rows});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}