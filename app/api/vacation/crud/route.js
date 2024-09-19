import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";
import DateHelper from "@/services/date.helpers";

export const POST = async (request) => {
   const create = async (model, params) => {
      const result = await prisma.vacation.create({
         data: {
            year: params.year,
            staff_id: model.staff_id,
            start_date: new Date(model.start_date),
            end_date: new Date(model.end_date),
         }
      })

      const _calendar = await prisma.dept_calendar.findFirst({
         where: {
            year: params.year,
            division_id: Number(params.division_id)
         }
      })
      const _staff = await prisma.staff.findUnique({
         where: {
            id: model?.staff_id
         }
      })
      const _row = await prisma.dept_calendar_row.findFirst({
         where: {
            calendar_id: _calendar.id,
            rate_id: _staff.rate_id
         }
      })
      let _date = new Date(model.start_date);
      const _end_date = new Date(model.end_date);
      while(_date <= _end_date){         
         const _month = _date.getMonth();
         const _day = _date.getDate();         
         
         await prisma.dept_calendar_cell.updateMany({
            where: {
               row_id: _row.id,
               month: _month+1,
               day: _day
            },
            data: {
               type: 5
            }
         })

         _date = DateHelper.addDays(_date, 1);
      }

      return result;
   }

   const read = async (model, year, division_id) => {
      const count = await prisma.$queryRaw`
         select
            *
         from
            vacation v
            left join staff sta on v.staff_id = sta.id
            left join employee e on sta.employee_id = e.id
            left join rate r on sta.rate_id = r.id
         where
            r.division_id = ${division_id}
            and v.year = ${year}
            and position(lower(${model.searchStr??''}) in lower(e.surname || ' ' || e.name || ' ' || e.pathname)) > 0 
      `;

      const totalCount = Number(count.length);

      const result = await prisma.$queryRaw`
         select
            v.id,
            v.year,
            v.start_date,
            v.end_date,
            e.surname || ' ' || e.name || ' ' || e.pathname as name,
            sta.id as staff_id
         from
            vacation v
            left join staff sta on v.staff_id = sta.id
            left join employee e on sta.employee_id = e.id
            left join rate r on sta.rate_id = r.id
         where
            r.division_id = ${division_id}
            and v.year = ${year}
            and position(lower(${model.searchStr??''}) in lower(e.surname || ' ' || e.name || ' ' || e.pathname)) > 0  
         order by
            e.surname || ' ' || e.name || ' ' || e.pathname,
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
            staff_id: model.staff_id,
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
            result = await read(model, params.year, params.division_id);
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