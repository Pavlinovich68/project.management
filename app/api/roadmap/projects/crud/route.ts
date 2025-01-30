import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IRoadmapItem, IRoadmapItemCRUD, IRoadmapItemsCollection } from "@/models/IRoadmapItem";

export const POST = async (request: NextRequest) => {
   const create = async (model: IRoadmapItemCRUD) => {
      const result = await prisma.roadmap_item.create({
         data: {
            roadmap_id: model.roadmap_id,
            project_id: model.project_id,
            start_date: model.start_date,
            end_date: model.end_date,
            developer_qnty: model.developer_qnty,
            hours: model.hours,
            comment: model.comment
         }
      });
      return result;
   }

   const read = async (year: number, division_id: number): Promise<IRoadmapItemsCollection | undefined> => {
      const data = await prisma.roadmap.findFirst({
         where: {
            year: year,
            division_id: division_id
         },
         select: {
            id: true,
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

      const projectCode = (code: string) => {
         const length = code.length;
         const result = Number(code.substring(1, length));
         return result;
      }

      const items:IRoadmapItem[] | undefined = data?.roadmap_items.map((item) => {
         return {
            roadmap_id: data?.id,
            id: item.id,
            project_id: item.project.id,
            project_code: item.project.code,
            project_name: item.project.name
         }
      }).sort(function(a, b) { return projectCode(a.project_code) - projectCode(b.project_code) })

      return items ? {roadmap_id: items[0].roadmap_id, items: items} : {roadmap_id: 0, items: []};
   }

   const update = async (model: IRoadmapItemCRUD) => {
      const result = await prisma.roadmap_item.update({
         where: {
            id: model.id
         },
         data: {
            roadmap_id: model.roadmap_id,
            project_id: model.project_id,
            start_date: model.start_date,
            end_date: model.end_date,
            developer_qnty: model.developer_qnty,
            hours: model.hours,
            comment: model.comment
         }         
      })
      return result;
   }

   const drop = async (id: number) => {
      const result = await prisma.roadmap_item.delete({
         where: {
            id: id
         }
      });

      return result;
   }

   const { operation, model, params } = await request.json();
   try {      
      let result = null;
      switch (operation) {
         case CRUD.read:
            const year: number = params.year;
            const division_id: number = params.division_id;
            result = await read(year, division_id);
            break;
         case CRUD.create:
            result = await create(model);
            break;
         case CRUD.update:
            result = await update(model);
            break;
         case CRUD.delete:
            result = await drop(model.id);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}