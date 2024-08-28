import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const readNode = async (id) => {
      const data = await prisma.division.findMany({
         where : {parent_id: id},
         orderBy: {
            name: 'asc'
         }
      });

      const result = data.map((item) => {
         return {
            key: `${id??0}-${item.id}`,
            label: item.name,
            data: {
               id: item.id,
               name: item.name
            }
         }
      });

      for (const node of result) {
         node.children = await readNode(node.data.id);
      }

      return result;
   }

   const create = async (model) => {
      const result = await prisma.division.create({
         data: {
            name: model.name,
            parent_id: model.parent_id
         }
      });

      return result;
   }

   const read = async (model) => {
      const result = await readNode(null);
      return result;
   }

   const update = async (model) => {
      const result = await prisma.division.update({
         where: {
            id: model.id
         },
         data: {
            name: model.name
         }
      });

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.division.delete({
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