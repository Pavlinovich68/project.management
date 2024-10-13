import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model, params) => {
      const result = await prisma.employee.create({
         data: {
            name: model.name,
            email: model.email,
            contacts: model.contacts,
            begin_date: model.begin_date,
            end_date: model.end_date
         }
      });
      return result;
   }

   const read = async (model, params) => {
      let filter = {};
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['name', 'email', 'contacts'], model.searchStr);
         if (!model.showClosed) {
            filter['AND'] = [{ OR: [{ end_date: null }, { end_date: { gt: new Date() } }]}];
         }
      } else {
         if (!model.showClosed) {
            filter['OR'] = [{end_date: null}, {end_date: { gt: new Date() }}];
         }
      }      

      const totalCount = await prisma.employee.count({where: filter});
      const result = await prisma.employee.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy
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
      const result = await prisma.employee.update({
         where: {
            id: model.id
         },
         data: {
            name: model.name,
            email: model.email,
            contacts: model.contacts,
            begin_date: model.begin_date,
            end_date: model.end_date
         }
      });
      return result;
   }


   const drop = async (model) => {
      const result = await prisma.employee.delete({
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
            result = await create(model, params);
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
      return await NextResponse.json({status: 'error', data: error });
   }
}