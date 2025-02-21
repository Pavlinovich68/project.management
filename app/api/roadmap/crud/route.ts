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
      const result = await prisma.roadmap_item.create({
         data: {
            comment: model.comment,
            hours: model.hours,
            is_closed: false,
            project_id: model.project.id??0,
            roadmap_id: roadmap.id
         }
      });

      return {
         id: result.id,
         comment: result.comment,
         hours: result.hours,
         is_closed: result.is_closed,
         roadmap_id: result.roadmap_id,
         project: {id: result.project.id, name: result.project.name}
      }
   }

   const read = async (model: IDataSourceRequest, params: IParams): Promise<IDataSourceResult> => {
      let filter: any = {};
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['project.name', 'comment'], model.searchStr);
      }
      const totalCount = await prisma.roadmap_item.count({where: filter});
      const result = await prisma.roadmap_item.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
      });

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
            project_id: model.project.id??0,
            roadmap_id: model.roadmap_id
         }
      });

      return {
         id: result.id,
         comment: result.comment,
         hours: result.hours,
         is_closed: result.is_closed,
         roadmap_id: result.roadmap_id,
         project: {id: result.project.id, name: result.project.name}
      }
   }

   const drop = async (id: number): Promise<IRoadmapItem> => {
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
         project: {id: result.project.id, name: result.project.name}
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
            result = await drop(inputData.model as number);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}