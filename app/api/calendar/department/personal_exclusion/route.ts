import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";

interface IModel {
}

interface IParams {
}

export const POST = async (request: NextRequest) => {
   const create = async (model: IModel, params: IParams): Promise<IModel> => {
      const result: IModel = {}

      return result
   }

   const read = async (model: IDataSourceRequest, params: IParams): Promise<IDataSourceResult> => {
      let filter = {};
      const totalCount = await prisma.personal_exclusion.count({where: filter});
      const result = await prisma.personal_exclusion.findMany({
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

   const update = async (model: IModel): Promise<IModel> => {
      const result: IModel = {};

      return result;
   }

   const drop = async (id: number): Promise<IModel> => {
      const result: IModel = await prisma.personal_exclusion.delete({
         where: {
            id: id
         }
      });

      return result;
   }

   const inputData: { operation: CRUD, model: any, params: IParams } = await request.json();
   try {
      let result = null;
      switch (inputData.operation) {
         case CRUD.read:
            result = await read(inputData.model as IDataSourceRequest, inputData.params);
            break;
         case CRUD.create:
            result = await create(inputData.model as IModel, inputData.params);
            break;
         case CRUD.update:
            result = await update(inputData.model as IModel);
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