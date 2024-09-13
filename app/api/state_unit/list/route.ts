import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   const model = await request.json();   
   const beginDate = new Date(model.year, 0, 31);
   const endDate = new Date(model.year, 11, 31);
   try {
      const result = await prisma.$queryRaw`
         select
         sta.id,
         e.surname || ' ' || e.name || ' ' || e.pathname as name
      from
         state_unit sta
         left join stuff_unit stu on sta.stuff_unit_id = stu.id
         left join employee e on sta.employee_id = e.id
      where
         stu.division_id = ${model.division_id}
         and e.begin_date <= ${beginDate}
         and (e.end_date is null or e.end_date > ${endDate});
      `;

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}