import { IBaseEntity } from "@/models/IBaseEntity";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
   try {
      const url = new URL(request.url);
      const division_id = url.searchParams.get("division_id");
      const data = await prisma.staff.findMany({
         where: {
            rate: {
               division_id: Number(division_id)
            }
         },
         include: {
            employee: true
         },
         orderBy: {
            employee: {
               name: 'asc'
            }
         }
      })

      if (!data)
         throw new Error('Не найдено ни одного сотрудника привязанного к ставке.')

      const result = data.map((item) => {return {id: item.id, name: item.employee.name}});

      return NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return NextResponse.json({status: 'error', data: error });
   }
}