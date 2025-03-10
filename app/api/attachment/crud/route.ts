import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import { IAttachment } from "@/models/IAttachment";

interface IModel {
}

interface IParams {
}

export const POST = async (request: NextRequest) => {
   const create = async (model: IModel, params: IParams): Promise<IModel> => {
      const result: IModel = {}

      return result
   }

   const read = async (bucket_name: string): Promise<IAttachment | undefined | void> => {
      const bucket = `${process.env.ROOT_BUCKET}/${bucket_name}`;
      const result: IAttachment[] = await prisma.attachment.findMany({
         where: {
            bucket_name: bucket
         },
         select: {
            id: true,
            filename: true,
            bucket_name: true,
            date: true,
            size: true,
            type: true,
            md5: true
         }
      });      
      result;
   }

   const update = async (model: IModel): Promise<IModel> => {
      const result: IModel = {};

      return result;
   }

   const drop = async (id: number): Promise<IModel> => {
      const result: IModel = await prisma.attachment.delete({
         where: {
            id: id
         }
      });

      return result;
   }

   const inputData: { operation: CRUD, model: any } = await request.json();
   try {
      let result = null;
      switch (inputData.operation) {
         case CRUD.read:
            result = await read(inputData.model as string);
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