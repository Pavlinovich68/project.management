import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IRoadmapItem, IRoadmapItemCRUD } from "@/models/IRoadmapItem";

export const POST = async (request: NextRequest) => {
   const create = async (model: IRoadmapItemCRUD) => {
      console.log(model);
   }

   const read = async (year: number, division_id: number): Promise<IRoadmapItem[] | undefined> => {
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

      const result:IRoadmapItem[] | undefined = data?.roadmap_items.map((item) => {
         return {
            roadmap_id: data?.id,
            id: item.id,
            project_id: item.project.id,
            project_code: item.project.code,
            project_name: item.project.name
         }
      }).sort(function(a, b) { return projectCode(a.project_code) - projectCode(b.project_code) })
      
      return result;
   }

   // const update = async (model) => {
      
   // }

   // const drop = async (model) => {
   //    const result = await prisma..delete({
   //       where: {
   //          id: model.id
   //       }
   //    });

   //    return result;
   // }

   const { operation, model, params } = await request.json();
   try {      
      let result = null;
      switch (operation) {
         case CRUD.read:
            const year: number = params.roadmap_id;
            const division_id: number = params.division_id;
            result = await read(year, division_id);
            break;
         case CRUD.create:
            result = await create(model);
            break;
         case CRUD.update:
            //result = await update(model);
            break;
         case CRUD.delete:
            //result = await drop(model);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}