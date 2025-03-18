import prisma from "@/prisma/client";
import DateHelper from "@/services/date.helpers";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const params: { year: number, month: number, day: number, user_id: number } = await request.json();
      const user = await prisma.users.findUnique({where: {id: params.user_id}});
      if (!user)
         throw Error("Не удалось найти пользователя");

      const roadmap = await prisma.roadmap.findFirst({ where: { year: params.year } });
      if (!roadmap)
         throw Error(`Не удалось найти дорожную карту за ${params.year} год`);

      const rows = await prisma.roadmap_fact_item.findMany({
         include: {
            roadmap_item: {
               include: {
                  project: true,
                  roadmap: true
               }
            },
            employee: {
               include: {
                  staff: true
               }
            }
         },
         where: {
            employee_id: user.employee_id,
            roadmap_item: {
               roadmap_id: roadmap.id
            }
         }
      });

      return await NextResponse.json({status: 'success', data: rows});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}