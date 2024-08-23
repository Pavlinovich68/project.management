import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
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
      let filter = {};
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['code', 'name', 'division.name'], model.searchStr);
         if (!model.showClosed) {
            filter['AND'] = [{ OR: [{ end_date: null }, { end_date: { gt: new Date() } }]}];
         }
      } else {
         if (!model.showClosed) {
            filter['OR'] = [{end_date: null}, {end_date: { gt: new Date() }}];
         }
      }

      const totalCount = await prisma.project.count({where: filter});
      const result = await prisma.project.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
         include: {division: true}
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