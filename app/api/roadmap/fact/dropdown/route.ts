import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   const { year } = await request.json();
   try {
      let roadmap = await prisma.roadmap.findFirst({where: {year: year}});
      if (!roadmap)
         throw Error(`Не удалось найти дорожную карту на ${year} год`)
      const result = (await prisma.roadmap_item.findMany({
         where: {
            roadmap_id: roadmap?.id
         },
         select: {
            project: {
               select: {
                  id: true,
                  code: true,
                  name: true
               }
            }
         }
      })).map((item) => {return {id: item.project.id, code: item.project.code, name: item.project.name}});
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}