import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";
import { count } from "console";

export const POST = async (request) => {
   const create = async (model) => {
      const result = await prisma.stuff_unit.create({
         data: {
            post_id: model.post.id,
            division_id: model.division.id,
            count: model.count,
         }
      })

      return result;
   }

   const read = async (model, params) => {
      let filter = {
         division_id: params.division_id,
      };
      if (model.searchStr) {
         filter = {
            AND:  [
                     {
                        post: {
                           name: {
                              contains: model.searchStr,
                              mode: 'insensitive'
                           }
                        }
                     },
                     {
                        division_id: params.division_id
                     }
                  ]
         }
      }

      const totalCount = await prisma.stuff_unit.count({where: filter});
      const result = await prisma.stuff_unit.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
         include: {
            division: true,
            post: true
         }
      });

      let data = {
         recordCount: totalCount,
         pageCount: Math.ceil(totalCount / model.pageSize),
         pageNo: model.pageNo,
         pageSize: model.pageSize,
         result: result
      };
      return data;
   }

   const update = async (model) => {
      return await prisma.stuff_unit.update({
         where: {
            id: model.id
         },
         data: {
            count: model.count,
         }
      });
   }

   const drop = async (model) => {
      const result = await prisma.stuff_unit.delete({
         where: {
            id: model.id
         }
      });

      return result;
   }

   const { operation, model, params } = await request.json();
   try {
      let result = null;
      switch (operation) {
         case CRUD.read:
            result = await read(model, params);
            break;
         case CRUD.create:
            result = await create(model);
            break;
         case CRUD.update:
            result = await update(model);
            break;
         case CRUD.delete:
            result = await drop(model);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}