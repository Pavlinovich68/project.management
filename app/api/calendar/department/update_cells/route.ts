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
   const { cells } = await request.json();
   try {
      let result = null;
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}