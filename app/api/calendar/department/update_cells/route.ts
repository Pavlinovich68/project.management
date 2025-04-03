import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import { ICalendarCell } from "@/models/ICalendar";

interface ICell {
   year: number,
   month: number,
   rate_id: number,
   cell: ICalendarCell
}

export const POST = async (request: NextRequest) => {
   const { cells: ICell[] } = await request.json();
   try {
      let result = null;
      if ()

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