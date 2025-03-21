import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import ProjectHelper from "@/services/project.helper";

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

   const read = async (params: IParams): Promise<any> => {
      const rows = await prisma.roadmap_fact_item.findMany({
         where: {
            month: params.month,
            day: params.day,
            employee_id: params.employee_id,
            roadmap_item: {
               roadmap_id: params.roadmap_id
            }
         },
         include: {
            roadmap_item: {
               include: {
                  roadmap: true
               }
            }
         }
      });

      const result: IRoadmapFactItem[] = [];
      for (let i of rows) {
         const project_name = await ProjectHelper.fullName(i.roadmap_item.project_id, undefined);
         const item: IRoadmapFactItem = {
            id: i.id,
            year: i.roadmap_item.roadmap.year,
            month: i.month,
            day: i.day,
            ratio: i.ratio,
            note: i.note,
            roadmap_item_id: i.roadmap_item_id,
            project_id: i.roadmap_item.project_id,
            project_name: project_name,
            employee_id: i.employee_id,
            is_deleted: false
         }
         result.push(item);
      }
      return result;
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
            result = await read(params);
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