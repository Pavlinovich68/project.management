import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const projectCode = (code) => {
      const length = code.lenght;
      const result = Number(code.substring(1, length));
      return result;
   }
   const readNode = async (id) => {
      const data = await prisma.project.findMany({
         where : {parent_id: id},
         orderBy: {
            code: 'asc'
         }
      });

      const result = data.map((item) => {
         return {
            key: item.id.toString(),
            label: item.name,
            data: {
               id: item.id,
               name: item.name,
               code: item.code,
               parent_id: id
            }
         }
      }).sort(function(a, b) {return projectCode(a.data.code) - projectCode(b.data.code)});

      for (const node of result) {
         node.children = await readNode(node.data.id);
      }

      return result;
   }

   const create = async (model) => {
      let _end_date = null;
      if (model.end_date)
         _end_date = model.end_date
      const result = await prisma.project.create({
         data: {
            code: model.code,
            name: model.name,
            division_id: model.division.id,
            begin_date: new Date(model.begin_date),
            end_date: _end_date
         }
      });

      return result;
   }

   const read = async (model) => {
      const result = await readNode(null);
      return result;
   }

   const update = async (model) => {
      let _end_date = null;
      if (model.end_date)
         _end_date = model.end_date

      const result = await prisma.project.update({
         where: {
            id: model.id
         },
         data: {
            code: model.code,
            name: model.name,
            division_id: model.division.id,
            begin_date: new Date(model.begin_date),
            end_date: _end_date
         }
      });

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.project.delete({
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