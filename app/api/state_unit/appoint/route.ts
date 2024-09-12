import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   const model = await request.json();
   try {
      const result = await prisma.state_unit.create({
         data: {
            stuff_unit_id: model.stuff_unit_id,
            employee_id: model.employee_id
         }
      })
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}