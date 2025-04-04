import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import prisma from "@/prisma/client";
import DateHelper from "@/services/date.helpers";
import { roadmap_fact_item } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {      
      const model: { items: IRoadmapFactItem[] } = await request.json();

      if (model.items.length === 0)
         return await NextResponse.json({status: 'success', data: []});
      const firstItem = model.items[0];
      const roadmap = await prisma.roadmap.findFirst({ where: { year: firstItem.year } });
      if (!roadmap)
         throw Error(`Не удалось найти дорожную карту за ${model.items[0].year} год`);
      const currentDay = DateHelper.toUTC(new Date(firstItem.year, firstItem.month, firstItem.day));
      const notProductionStaffs = (await prisma.staff.findMany({
         include: {
            rate: true,
            employee: true
         },
         where: {
            AND: [
               {
                  begin_date: {
                     lt: currentDay
                  },
                  OR: [
                     {
                        end_date: null
                     },
                     {
                        end_date: {
                           gte: currentDay
                        }
                     }
                  ]
               },
               {
                  rate: {
                     is_production_staff: false,
                     division_id: roadmap.division_id
                  }
               }
            ]
         }
      })).map(i => i.employee)

      //return await NextResponse.json({status: 'success', data: notProductionStaffs});

      const result: IRoadmapFactItem[] = [];

      let resultItem: roadmap_fact_item;
      for(const item of model.items){         
         if (item.is_deleted) {
            if (item.id) {
               await prisma.roadmap_fact_item.delete({
                  where: {
                     id: item.id
                  }
               });

               for (const np of notProductionStaffs) {
                  const npItems = await prisma.roadmap_fact_item.findMany({
                     where: {
                        parent_id: item.id
                     }
                  });
                  for (const _np of npItems) {
                     await prisma.roadmap_fact_item.delete({where: {id: _np.id}});
                  }
               }
            }
         } else {            
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

               for (const np of notProductionStaffs) {
                  await prisma.roadmap_fact_item.create({
                     data: {
                        month: resultItem.month,
                        day: resultItem.day,
                        ratio: resultItem.ratio,
                        note: resultItem.note,
                        employee_id: np.id,
                        roadmap_item_id: resultItem.roadmap_item_id,
                        parent_id: resultItem.id
                     }
                  })
               }
            } else {
               resultItem = await prisma.roadmap_fact_item.update({
                  where: {
                     id: item.id
                  },
                  data: {
                     ratio: item.ratio??0,
                     note: item.note??'',
                     roadmap_item_id: _item?.id??0
               }});

               await prisma.roadmap_fact_item.updateMany({
                  where: {
                     parent_id: item.id
                  },
                  data: {
                     ratio: resultItem.ratio,
                     note: resultItem.note,
                     roadmap_item_id: resultItem.roadmap_item_id
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