import { IBaseDivision } from "@/models/IDivision";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
   const url:URL = new URL(request.url);
   const id: number = Number(url.searchParams.get("id"));
   if (id) {
      try {
         const result: IBaseDivision | null = await prisma.division.findUnique({
            where: {id: id}
         });
         if (!result)
            throw new Error("Division not found");
         return NextResponse.json({status: 'success', data: result});
      } catch (error) {
         return NextResponse.json({status: 'error', data: error });
      }
   }
}