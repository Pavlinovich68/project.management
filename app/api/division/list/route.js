import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request) => {
   try {
      const data = await prisma.division.findMany({
         select: {
            id: true,
            name: true,
         },
         orderBy: {
            name: 'asc'
         }
      });
      return await NextResponse.json({status: 'success', data: data});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}