import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model) => {
      const _date = new Date(model.date);
      const _year = _date.getFullYear();

      let _calendar = await prisma.production_calendar.findFirst({ where: { year: _year } });
      if (!_calendar) {
         _calendar = await prisma.production_calendar.create({
            data: {
               year: _year
            }
         });
      }

      const is_exists = await prisma.exclusion.findFirst({
         where: {
            production_calendar_id: _calendar.id,
            date: new Date(model.date),
            exclusion_type: model.exclusion_type.code,
         }
      })

      if (is_exists) return is_exists;

      const result = await prisma.exclusion.create({
         data: {
            production_calendar_id: _calendar.id,
            date: new Date(model.date),
            exclusion_type: model.exclusion_type.code,
         }
      })

      return result;
   }

   const read = async (model, year) => {
      const totalCount = await prisma.exclusion.count({
         where: { 
            production_calendar: {
               year: year
            } 
         }
      });
      let result = await prisma.exclusion.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: { 
            production_calendar: {
               year: year
            }
         },
         orderBy: {
            date: "asc"
         }
      });

      result = result.map(item => {
         let name = undefined;
         switch (item.exclusion_type) {            
            case 0:
               name = 'Празничный день';
               break;
            case 1:
               name = 'Сокращенный рабочий день';
               break;
            case 2:
               name = 'Перенесенный праздничный день';
               break;
            case 3:
               name = 'Перенесенный рабочий день';
               break;
         }
         return {
            id: item.id,
            production_calendar_id: item.production_calendar_id,
            date: item.date,
            exclusion_type: item.exclusion_type,
            exclusion_type_name: name
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
      const result = await prisma.exclusion.update({
         where: {
            id: model.id
         },
         data: {
            date: new Date(model.date),
            exclusion_type: model.exclusion_type.code,
         }
      })

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.exclusion.delete({
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