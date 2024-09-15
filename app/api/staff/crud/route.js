import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model, params) => {
      const result = await prisma.staff.create({
         data: {
            employee_id: model.employee.id,
            rate_id: model.rate.id
         }
      });

      return result;
   }

   const read = async (model, params) => {
      let filter = {
         rate: {
            division: {
               id: params.division_id
            }
         }
      };

      if (model.searchStr) {
         filter = {
            AND:  [
                     {
                        OR: [
                           { employee: { name: { contains: model.searchStr, mode: 'insensitive' }}},
                           { employee: { surname: { contains: model.searchStr, mode: 'insensitive'}}},
                           { employee: { pathname: { contains: model.searchStr, mode: 'insensitive'}}}
                        ]
                     },
                     { rate: { division: { id: params.division_id }}}                     
                  ]
         }
      }
      const totalCount = await prisma.staff.count({where: filter});
      const list = await prisma.staff.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: {
            rate: {
               no: 'asc'
            }
         },
         select: {
            id: true,
            rate_id: true,
            employee_id: true,
            employee: {
               select: {
                  id: true,
                  name: true,
                  surname: true,
                  pathname: true
               }            
            },
            rate: {
               select: {
                  no: true,
                  post: {
                     select: {                        
                        name: true
                     }
                  }
               }
            }
         }         
      });

      const result = list.map(item => {
         return {
            id: item.id,
            employee: {
               id: item.employee_id,
               name: item.employee.surname + ' ' +
                     item.employee.name + ' ' +
                     item.employee.pathname
            },
            rate: {
               id: item.rate_id,
               name: item.rate.no + ' ' + item.rate.post.name
            }
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
   }

   const drop = async (model) => {
      const result = await prisma.staff.delete({
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