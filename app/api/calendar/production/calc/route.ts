import { IRoadmapItem } from "@/models/IRoadmapItem";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { begin_date, end_date } = await request.json();

      const result = true;

      return await NextResponse.json({status: 'success', data: result});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
