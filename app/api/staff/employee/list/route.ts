import { IBaseEntity } from "@/models/IBaseEntity";
import { IBaseDivision } from "@/models/IDivision";
import { IStaffRate } from "@/models/IStaff";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
   try {
      const data: any[] | null = await prisma.employee.findMany({
         select: {
            id: true,
            name: true
         }
      });

      const result: IBaseEntity[] = data.map(item => {return {id: item.id, name: item.name}});

      return NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return NextResponse.json({status: 'error', data: error });
   }
}