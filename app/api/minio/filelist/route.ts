import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type";
import { IDataSourceRequest } from "@/types/IDataSourceRequest";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import minioClient from "@/lib/minio-client";

interface IModel {
   id: number
   filename: string
   bucket_name: string
   date: Date
   size: number
   type: string
   md5: string
}

interface IParams {
}

export const POST = async (request: NextRequest) => {
   const params: { bucket_name: string } = await request.json();
   try {
      const bucket = `${process.env.ROOT_BUCKET}/${params.bucket_name}`;
      const result: IModel[] = await prisma.attachment.findMany({
         where: {
            bucket_name: bucket
         },
         select: {
            id: true,
            filename: true,
            bucket_name: true,
            date: true,
            size: true,
            type: true,
            md5: true
         }
      });
      
      return await NextResponse.json({status: 'success', data: result});
      

      
      //const destinationObject = 'Список систем по ГК.xlsx'

      // const exists = await minioClient.bucketExists(bucket)
      // if (!exists) {
      //    await minioClient.makeBucket(bucket);

      // const data = []
      // const stream = minioClient.listObjects(bucket_name);
      // stream.on('data', function (obj) {
      //    data.push(obj)
      // })
      // // Set the object metadata
      // var metaData = {
      //    'Content-Type': 'text/plain',
      //    'X-Amz-Meta-Testing': 1234,
      //    example: 5678,
      // }

      // // Upload the file with fPutObject
      // // If an object with the same name exists,
      // // it is updated with new data
      // await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
      // console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)


   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}