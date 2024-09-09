import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model) => {
      return await prisma.post.create({
         data: {
            name: model.name
         }
      });
   }

   const read = async (model) => {
      let filter = {};
      if (model.searchStr) {
         filter = {
            name: {
               contains: model.searchStr,
               mode: 'insensitive'
            }
         }
      }

      const totalCount = await prisma.post.count({where: filter});
      const result = await prisma.post.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: {
            name: 'asc'
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
      return await prisma.post.update({
         where: {
            id: model.id
         },
         data: {
            name: model.name
         }
      });
   }

   const drop = async (model) => {
      const result = await prisma.post.delete({
         where: {
            id: model.id
         }
      });

      return result;
   }

   const { operation, model } = await request.json();
   try {
      let result = null;
      switch (operation) {
         case CRUD.read:
            result = await read(model);
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