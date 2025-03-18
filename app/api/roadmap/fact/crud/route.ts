import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";

interface IParams {
   year: number
   month: number
   day: number
   user_id: number
   employee_id: number | undefined
   roadmap_id: number | undefined
}

export const POST = async (request: NextRequest) => {
   // const create = async (model: IModel, params: IParams): Promise<IModel> => {
   //    const result: IModel = {}

   //    return result
   // }

   const read = async (model: IDataSourceRequest, params: IParams): Promise<IDataSourceResult> => {
      const rows = await prisma.roadmap_fact_item.findMany({
         include: {
            roadmap_item: {
               include: {
                  project: true,
                  roadmap: true
               }
            },
            employee: {
               include: {
                  staff: true
               }
            }
         },
         where: {
            employee_id: params.employee_id,
            roadmap_item: {
               roadmap_id: params.roadmap_id
            }
         }
      });

      const result: IRoadmapFactItem[] =  rows.map(i => { return {
         id: i.id,
         year: i.roadmap_item.roadmap.year,
         month: i.month,
         day: i.day,
         roadmap_item_id: i.roadmap_item_id,
         ratio: i.ratio,
         project: {
            id: i.roadmap_item.project_id,
            code: i.roadmap_item.project.code,
            name: i.roadmap_item.project.name
         },
         employee: {
            id: i.employee_id,
            name: i.employee.name
         }

      }})
      let data: IDataSourceResult = {
         recordCount: 0,
         pageCount: 1,
         pageNo: model.pageNo,
         pageSize: model.pageSize,
         result: result
      };
      return data;
   }

   // const update = async (model: IModel): Promise<IModel> => {
   //    const result: IModel = {};

   //    return result;
   // }

   // const drop = async (id: number): Promise<IModel> => {
   //    const result: IModel = await prisma.roadmap_fact_item.delete({
   //       where: {
   //          id: id
   //       }
   //    });

   //    return result;
   // }

   const inputData: { operation: CRUD, model: any, params: IParams } = await request.json();
   try {
      const user = await prisma.users.findUnique({where: {id: inputData.params.user_id}});
      if (!user)
         throw Error("Не удалось найти пользователя");

      const roadmap = await prisma.roadmap.findFirst({ where: { year: inputData.params.year } });
      if (!roadmap)
         throw Error(`Не удалось найти дорожную карту за ${inputData.params.year} год`);

      const params = {...inputData.params, employee_id: user.employee_id, roadmap_id: roadmap.id};

      let result = null;
      switch (inputData.operation) {
         case CRUD.read:
            result = await read(inputData.model as IDataSourceRequest, params);
            break;
         case CRUD.create:
            //result = await create(inputData.model as IModel, inputData.params);
            break;
         case CRUD.update:
            //result = await update(inputData.model as IModel);
            break;
         case CRUD.delete:
            //result = await drop(inputData.model as number);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}