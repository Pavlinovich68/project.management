import minioClient from "@/lib/minio-client";
import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import { createHash } from 'node:crypto';
import { Readable } from 'stream';

const md5 = (content: any) => {
   return createHash('md5').update(content).digest('hex')
}

function webReadableToNodeReadable(webStream: ReadableStream<Uint8Array>): Readable {
   const reader = webStream.getReader();
   return new Readable({
   async read() {
      const { done, value } = await reader.read();
      if (done) {
      this.push(null);
      } else {
      this.push(Buffer.from(value));
      }
   },
});
}

export const POST = async (request: NextRequest, response: NextResponse) => {      
   try {
      const model = await request.formData();
      const file = model.get('file') as File;
      const path = model.get('path');
      const fileStream = await file.stream();

      const bucket = process.env.ROOT_BUCKET??'unknown_bucket';
      const exists = await minioClient.bucketExists(bucket)
      if (!exists) {
         await minioClient.makeBucket(bucket);
      }      
      const obj = await minioClient.putObject(bucket, `${path}/${file.name}`, webReadableToNodeReadable(fileStream), file.size, {'Content-Type': file.type});

      console.log(obj);

      const result = await prisma.attachment.create({
         data: {
            filename: file.name,
            object_name: path?.toString()??bucket,
            bucket_name: bucket,
            date: new Date(),
            size: file.size,
            type: file.type,
            etag: obj.etag
         }
      })

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}
