import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import prisma from "@/prisma/client";
import { roadmap_fact_item } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {      
      const model: { items: IRoadmapFactItem[] } = await request.json();

      if (model.items.length === 0)
         return await NextResponse.json({status: 'success', data: []});      

      const result: IRoadmapFactItem[] = [];

      let resultItem: roadmap_fact_item;
      for(const item of model.items){
         if (item.is_deleted) {
            if (item.id) {
               await prisma.roadmap_fact_item.delete({
                  where: {
                     id: item.id
                  }
               })
            }
         } else {
            const roadmap = await prisma.roadmap.findFirst({ where: { year: item.year } });
            if (!roadmap)
               throw Error(`Не удалось найти дорожную карту за ${item.year} год`);
            const _item = await prisma.roadmap_item.findFirst({
               where: {
                  roadmap_id: roadmap.id,
                  project_id: item.project_id
               }
            })

            if (!item.id) {
               resultItem = await prisma.roadmap_fact_item.create({
                  data: {
                     month: item.month,
                     day: item.day,
                     ratio: item.ratio??0,
                     note: item.note??'',
                     employee_id: item.employee_id??0,
                     roadmap_item_id: _item?.id??0
               }});
            } else {
               resultItem = await prisma.roadmap_fact_item.update({
                  where: {
                     id: item.id
                  },
                  data: {
                     month: item.month,
                     day: item.day,
                     ratio: item.ratio??0,
                     note: item.note??'',
                     employee_id: item.employee_id??0,
                     roadmap_item_id: _item?.id??0
               }});
            }
            result.push({
               id: resultItem.id,
               uuid: item.uuid,
               year: item.year,
               month: resultItem.month,
               day: resultItem.day,
               note: resultItem.note,
               roadmap_item_id: resultItem.roadmap_item_id,
               ratio: resultItem.ratio,
               project_id: item.project_id,
               employee_id: resultItem.employee_id,
               project_name: item.project_name,
               is_deleted: false
            })
         }         
      }
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}