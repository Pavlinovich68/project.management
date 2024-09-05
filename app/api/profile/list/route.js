import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request) => {
   try {
      const url = new URL(request.url);
      const begin_date = new Date(url.searchParams.get("begin_date"));
      const end_date = new Date(url.searchParams.get("end_date"));
      const division = Number(url.searchParams.get("division"));

      const records = await prisma.$queryRaw`
         select
            p.id as id,
            u.name as name
         from
            profile p left join users u on u.id = p.user_id
         where
            u.division_id = ${division}
            and p.begin_date <= ${begin_date}
            and (p.end_date is null or p.end_date > ${end_date})
         order by
            u.name;
      `;
      
      return await NextResponse.json({status: 'success', data: records});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}