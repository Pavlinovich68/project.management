import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model) => {
      const result = await prisma.vacation.create({
         data: {
            profile_id: model.profile_id,
            start_date: model.start_date,
            end_date: model.end_date,
         }
      })

      return result;
   }

   const read = async (model, year) => {
      let filter = {};
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['start_date', 'profile.user.name'], model.searchStr);
         filter['AND'] = { year: year };
      } else {
         filter = {
            year: year
         }
      }
      

      const totalCount = await prisma.vacation.count({where: filter});
      let result = await prisma.vacation.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
         include: {
            profile: {
               include: {
                  user: true
               }               
            }
         }});

      result = result.map((item) => {
         return {
            id: item.id,
            name: item.profile.user.name,
            profile_id: item.profile_id,
            start_date: item.start_date,
            end_date: item.end_date
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
      const result = await prisma.vacation.update({
         where: {
            id: model.id
         },
         data: {
            profile_id: model.profile_id,
            start_date: model.start_date,
            end_date: model.end_date,
         }
      })

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.vacation.delete({
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
            result = await read(model, params.year);
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