import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts";

export const POST = async (request) => {
   const create = async (model) => {
   }

   const read = async (model) => {
   }

   const update = async (model) => {
   }

   const drop = async (model) => {
   }

   const { operation, model } = await request.json();
   try {
      let result = null;
      switch (operation) {
         case CRUD.read:
            result = await read(model);
            break;
         case CRUD.create:
            result = await create(model);
            break;
         case CRUD.update:
            result = await update(model);
            break;
         case CRUD.delete:
            result = await drop(model);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}