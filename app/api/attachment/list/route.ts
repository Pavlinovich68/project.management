import { IAttachment } from "@/models/IAttachment";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, response: NextResponse) => {      
   try {
      const model = await request.json();
      const result: IAttachment[] = await prisma.attachment.findMany({
         where: {
            object_name: model.bucket_name
         },
         orderBy: {
            date: "asc"
         }
      })

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}