import prisma from "@/prisma/client";
import CalendarHelper from "@/services/calendar.helper";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { staff_id, year, month, roles } = await request.json();

      const isMasterRole = Object.keys(roles).indexOf("master") !== -1;

      const items = await prisma.staff.findFirst({
         where: {
            id: staff_id
         },
         select: {
            rate: {
               select: {
                  division: {
                     select: {
                        rate: {
                           select: {
                              staff: {
                                 where: {
                                    end_date: null
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      });
//@ts-ignore
      const staffs = items?.rate.division.rate.map(i => i.staff[0]).filter(i => isMasterRole ? true : i.id === staff_id);
      return await NextResponse.json({status: 'success', data: staffs});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
