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
            name: true,
            surname: true,
            pathname: true,
         }
      });

      const result: IBaseEntity[] = data.map(item => {return {id: item.id, name: item.surname + ' ' + item.name + ' ' + item.pathname}});

      // const data1 = await prisma.staff.findMany({
      //    select: {
      //       employee: {
      //          select: {
      //             id: true,
      //             name: true,
      //             surname: true,
      //             pathname: true,
      //          }
      //       }
      //    }
      // })

      // const unavailable: IBaseEntity[] = data1.map(item => {return {id: item.employee.id, name: item.employee.surname + ' ' + item.employee.name + ' ' + item.employee.pathname}});

      // const filtered = all.map(i => i.id).filter(elem_A => !unavailable.map(i => i.id).includes(elem_A));
      // const result = all.filter(i => {return filtered.includes(i.id)});

      return NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return NextResponse.json({status: 'error', data: error });
   }
}