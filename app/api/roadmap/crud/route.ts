import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import { IRoadmapItem } from "@/models/IRoadmapItem";
import prismaHelper from "@/services/prisma.helpers";

interface IParams {
   year: number
   division_id: number
}

export const POST = async (request: NextRequest) => {
   const create = async (model: IRoadmapItem, params: IParams): Promise<IRoadmapItem> => {
      let roadmap = await prisma.roadmap.findFirst({where: {year: params.year, division_id: params.division_id}});
      if (!roadmap) {
         roadmap = await prisma.roadmap.create({
            data: {
               year: params.year,
               division_id: params.division_id
            }
         });
      }
      if (!roadmap)
         throw new Error(`Отсутствует экземпляр дорожной карты на ${params.year} год`);
      const result = await prisma.roadmap_item.create({
         data: {
            comment: model.comment,
            hours: model.hours??0,
            is_closed: false,
            project_id: model.project?.id??0,
            roadmap_id: roadmap.id
         },
         include: {
            project: true
         }
      });

      if (!result || !result.project_id)
         throw Error('')
      return {
         id: result.id,
         comment: result.comment,
         hours: result.hours,
         fact: 0,
         plan_str: result.hours.toLocaleString('ru-RU'),
         fact_str: undefined,
         is_closed: result.is_closed,
         roadmap_id: result.roadmap_id,         
         project: {id: result.project_id, name: result.project.name}
      }
   }

   const read = async (model: IDataSourceRequest, params: IParams): Promise<IDataSourceResult> => {
      const roadmap = await prisma.roadmap.findFirst({where: {year: params.year, division_id: params.division_id}});
      let filter: any = {roadmap: {id: roadmap?.id??-1}};      
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['project.name', 'comment'], model.searchStr);
      }
      const totalCount = await prisma.roadmap_item.count({where: filter});
      const result = await prisma.roadmap_item.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
         include: {
            project: true,
            fact_items: true
         }         
      });

      for (let item of result) {
         let fact = 0;
         if (item.fact_items.length === 0) {
            continue;
         }
         for (let fi of item.fact_items)
            fact += fi.hours
         //@ts-ignore
         item.fact = fact;
         //@ts-ignore
         item.plan_str = `${item.hours.toLocaleString('ru-RU')} ч/ч`;
         //@ts-ignore
         item.fact_str = `${fact.toLocaleString('ru-RU')} ч/ч`;
      }

      let data: IDataSourceResult = {
         recordCount: totalCount,
         pageCount: Math.ceil(totalCount / model.pageSize),
         pageNo: model.pageNo,
         pageSize: model.pageSize,
         result: result
      };

      return data;
   }

   const update = async (model: IRoadmapItem): Promise<IRoadmapItem> => {
      const result = await prisma.roadmap_item.update({
         where: {
            id: model.id
         },
         data: {
            comment: model.comment,
            hours: model.hours,
            is_closed: model.is_closed,
            project_id: model.project?.id??0,
            roadmap_id: model.roadmap_id
         },
         include: {
            project: true
         }
      });

      const fact = await prisma.roadmap_fact_item.aggregate({
         where: {
            roadmap_item_id: result.id
         },
         _sum: {
            hours: true
         }
      });

      return {
         id: result.id,
         comment: result.comment,
         hours: result.hours,
         fact: fact._sum.hours??0,
         plan_str: result.hours.toLocaleString('ru-RU'),
         fact_str: (fact._sum.hours??0).toLocaleString('ru-RU'),
         is_closed: result.is_closed,
         roadmap_id: result.roadmap_id,
         project: {id: result.project.id, name: result.project.name}
      }
   }

   const drop = async (id: number): Promise<IRoadmapItem> => {
      await prisma.roadmap_fact_item.deleteMany({where: {roadmap_item_id: id}});

      const result = await prisma.roadmap_item.delete({
         where: {
            id: id 
         }
      });

      return {
         id: result.id,
         comment: result.comment,
         hours: result.hours,
         is_closed: result.is_closed,
         roadmap_id: result.roadmap_id,
         fact: undefined,
         fact_str: undefined,
         plan_str: undefined,
         project: undefined
      }
   }

   const inputData: { operation: CRUD, model: any, params: IParams } = await request.json();
   try {
      let result = null;
      switch (inputData.operation) {
         case CRUD.read:
            result = await read(inputData.model as IDataSourceRequest, inputData.params);
            break;
         case CRUD.create:
            result = await create(inputData.model as IRoadmapItem, inputData.params);
            break;
         case CRUD.update:
            result = await update(inputData.model as IRoadmapItem);
            break;
         case CRUD.delete:
            result = await drop(inputData.model.id as number);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}