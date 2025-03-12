import minioClient from "@/lib/minio-client";
import { IAttachment } from "@/models/IAttachment";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, response: NextResponse) => {      
   try {
      const model = await request.json();
      const attach = await prisma.attachment.findFirst({ where: {id: model.id}});

      if (!attach)
         throw new Error("Не удалось найти запись в таблице вложений");
      await minioClient.removeObject(process.env.ROOT_BUCKET as string, `${attach?.object_name}/${attach?.filename}`);
      await prisma.attachment.delete({where: {id: model.id}});

      return await NextResponse.json({status: 'success', data: attach});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}