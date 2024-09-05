import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model, params) => {
      const result = await prisma.vacation.create({
         data: {
            year: params.year,
            profile_id: model.profile_id,
            start_date: new Date(model.start_date),
            end_date: new Date(model.end_date),
         }
      })

      return result;
   }

   const read = async (model, year, division) => {
      const count = await prisma.$queryRaw`
         select
            count(*)
         from
            vacation v
            left join profile p on v.profile_id = p.id
            left join users u on p.user_id = u.id
         where
            u.division_id = ${division}
            and v.year = ${year}
            and position(lower(${model.searchStr??''}) in lower(u.name)) > 0 
      `;

      const totalCount = Number(count[0]?.count);

      const result = await prisma.$queryRaw`
         select
            v.id,
            v.year,
            v.profile_id,
            v.start_date,
            v.end_date,
            u.name
         from
            vacation v
            left join profile p on v.profile_id = p.id
            left join users u on p.user_id = u.id
         where
            u.division_id = ${division}
            and v.year = ${year}
            and position(lower(${model.searchStr??''}) in lower(u.name)) > 0 
         order by
            u.name,
            v.start_date
         limit ${model.pageSize}
         offset (${model.pageNo} -1) * ${model.pageSize}
      `;

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
            start_date: new Date(model.start_date),
            end_date: new Date(model.end_date),
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
            result = await read(model, params.year, params.division);
            break;
         case CRUD.create:
            result = await create(model, params);
            break;
         case CRUD.update:
            result = await update(model, params);
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