import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request) => {
   const url = new URL(request.url);
   const id = url.searchParams.get("id");
   if (id) {
      try {
         const result = await prisma.attachment.findFirst({
            where: {id: parseInt(id)}
         });
         result.body = result.body.toString();
         return NextResponse.json({status: 'success', data: result});
      } catch (error) {
         return NextResponse.json({status: 'error', data: error.stack });
      }
   }
}