import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   const { id } = await request.json();
   try {
      const result = await prisma.state_unit.delete({
         where: {
            id: id
         }
      });
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error });
   }
}