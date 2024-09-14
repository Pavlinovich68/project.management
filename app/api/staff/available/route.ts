import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";

export const GET = async (request: NextRequest) => {
   try {
      const url:URL = new URL(request.url);
      const id: number = Number(url.searchParams.get("id"));

      // Сотрудники привязанные к ставкам
      const filled = await prisma.state_unit.findMany({
         where: {
            stuff_unit: {
               division_id: id,
            }
         },
         include: {
            employee: true,
         }
      });
      const all = await prisma.employee.findMany({
         orderBy: {
            surname: "asc"
         }
      });

      const first = filled.map(item => item.employee_id);
      const second = all.map(item => item.id);
      const delta = second.filter(item =>!first.includes(item));
      const result = all.filter(item => delta.includes(item.id)).map(i => {return {id: i.id, name: `${i.surname} ${i.name} ${i.pathname}`}});

      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error });
   }
}