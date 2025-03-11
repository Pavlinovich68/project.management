import minioClient from "@/lib/minio-client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, response: NextResponse) => {
   const model = await request.json();
   try {
      const stream = await minioClient.getObject(process.env.ROOT_BUCKET as string, `${model.objectName}/${model.fileName}`);
      const readableStream = new ReadableStream({
         start(controller) {
            stream.on('data', (chunk) => {
               controller.enqueue(chunk);
            });

            stream.on('end', () => {
               controller.close();
            });

            stream.on('error', (err) => {
               controller.error(err);
            });
         },
      });

      return new NextResponse(readableStream, {
         headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${model.fileName}"`,
         },
      });
   } catch (error: any) {
      return NextResponse.json(
         { error: 'Failed to fetch object' },
         { status: 500 }
      );
   }
}