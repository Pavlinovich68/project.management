import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
   const url = new URL(request.url);
   const id = Number(url.searchParams.get("id"));
   if (id) {
      try {
         const row = await prisma.$queryRaw`
            select
               dcc.id as id,
               e.name,
               lpad(dcc.day::varchar, 2, '0') || '.' || lpad(dcc.month::varchar, 2, '0') || '.' || dc.year::varchar as date
            from
               dept_calendar_row dcr
               inner join dept_calendar_cell dcc on dcr.id = dcc.row_id
               inner join rate r on dcr.rate_id = r.id
               inner join staff s on r.id = s.rate_id
               inner join employee e on s.employee_id = e.id
               inner join dept_calendar dc on dcr.calendar_id = dc.id
            where
               dcc.id = ${id}
         `
         //@ts-ignore
         const result = row ? row[0] : undefined
         return NextResponse.json({status: 'success', data: result});
      } catch (error) {
         return NextResponse.json({status: 'error', data: error });
      }
   }
}