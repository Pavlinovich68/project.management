import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import { createHash } from 'node:crypto'

const md5 = (content: any) => {
   return createHash('md5').update(content).digest('hex')
}

export const POST = async (request: NextRequest) => {
   const model = await request.json();
   const hash = md5(model.body);
   let result = await prisma.attachment.findFirst({
      where: {
         type: model.type,
         filename: model.filename,
         size: model.size,
         md5: hash
      }
   });
   if (model.id && model.id !== result?.id){
      try {
         const droppedAttachment = await prisma.attachment.delete({
            where: {
               id: model.id
            }
         })
      } catch(error) {
         console.log(error);
      }
   }
   if (!result) {
      let buffer = Buffer.from(model.body);
      const fileDate = new Date(model.date);
      result = await prisma.attachment.create({
         data: {
            filename: model.filename,
            type: model.type,
            size: model.size,
            date: fileDate,
            body: buffer,
            md5: hash
         }
      });
   }
   try {
      return await NextResponse.json({status: 'success', data: {id: result.id}});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}

function computeChecksumMd5(file: any, File: { new(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag | undefined): File; prototype: File; }) {
   throw new Error("Function not implemented.");
}
