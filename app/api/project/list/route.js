import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const GET = async () => {
   try {
      const data = await prisma.project.findMany({
         orderBy: {
            code: 'asc'
         }
      });
      const result = data
      .map((item) => {
         return {
            id: item.id,
            name: `${item.code} - ${item.short_name}`
         }
      });
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}