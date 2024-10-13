import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model, params) => {
      const rateIsBusy = await prisma.staff.findFirst({
         where: {
            AND: [
               {
                  rate: {
                     id: model.rate.id
                  }
               },
               {
                  begin_date: {
                     lte: new Date(model.begin_date)
                  }
               },
               {
                  OR: [
                     {
                        end_date: null
                     },
                     {
                        end_date: {
                           gt: model.end_date ? new Date(model.end_date) : new Date()
                        }
                     }
                  ]
               }
            ]
         }
      });
      if (rateIsBusy)
         throw new Error('Ставка уже занята!');

      const employeeIsBusy = await prisma.staff.findFirst({
         where: {
            AND: [
               {
                  employee: {
                     id: model.employee.id
                  }
               },
               {
                  begin_date: {
                     lte: new Date(model.begin_date)
                  }
               },
               {
                  OR: [
                     {
                        end_date: null
                     },
                     {
                        end_date: {
                           gt: model.end_date ? new Date(model.end_date) : new Date()
                        }
                     }
                  ]
               }
            ]
         }
      });
      if (employeeIsBusy)
         throw new Error('Сотрудник уже привязан к другой ставке!');

      const result = await prisma.staff.create({
         data: {
            employee_id: model.employee.id,
            rate_id: model.rate.id,
            begin_date: model.begin_date,
            end_date: model.end_date
         }
      });

      return result;
   }

   const read = async (model, params) => {
      const currentDate = new Date();
      const dateFilter = !model.showClosed ? {
         OR: [
            { end_date: null },
            { end_date: { gt: currentDate } }
         ]
      } : {}
      let filter = {
         AND: [
            {
               rate: {
                  division: {
                     id: params.division_id
                  }
               },
               
            },
            {
               begin_date: {
                  lte: currentDate
               }
            },
            dateFilter
         ]
      };
      
      if (model.searchStr) {
         filter = {
            AND:  [
                     {
                        employee: { 
                           name: { 
                              contains: model.searchStr, mode: 'insensitive' 
                           }
                        }
                     },
                     {
                        rate: {
                           division: {
                              id: params.division_id
                           }
                        },
                        
                     },
                     {
                        begin_date: {
                           lte: currentDate
                        }
                     },
                     {
                        OR: [
                           { end_date: null },
                           { end_date: { gt: currentDate } }
                        ]
                     }
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
            begin_date: true,
            end_date: true,
            employee: {
               select: {
                  id: true,
                  name: true
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
            begin_date: item.begin_date,
            end_date: item.end_date,
            employee: {
               id: item.employee_id,
               name: item.employee.name
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
      await prisma.staff.update({
         where: {
            id: model.id
         },
         data: {
            end_date: model.end_date
         }
      })
   }

   const drop = async (model) => {      
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
      return await NextResponse.json({status: 'error', data: error.message });
   }
}