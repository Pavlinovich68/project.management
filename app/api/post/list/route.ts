import { IBaseEntity } from "@/models/IBaseEntity";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
   try {
      const result: IBaseEntity[] | null = await prisma.post.findMany({
         orderBy: {
            name: "asc"
         }
      });      
      return NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return NextResponse.json({status: 'error', data: error });
   }
}