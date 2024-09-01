import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const { division, year, month } = await request.json();
   try {
      let result = null;
      const _begin_date = new Date(year, month -1, 1);
      const _end_date = new Date(year, month, 0);
      result = await prisma.profile.findMany({
         where: {
            user: {
               division_id: division
            },
            AND: [
               {
                  begin_date: {
                     lte: _begin_date
                  },
                  OR: [
                     {
                        end_date: null
                     },
                     {
                        end_date: {
                           gte: _end_date
                        }
                     }
                  ]
               }
            ]
         },
         orderBy: {
            short_name: 'asc'
         }
      });
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}