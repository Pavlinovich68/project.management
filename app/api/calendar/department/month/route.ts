import prisma from "@/prisma/client";
import CalendarHelper from "@/services/calendar.helper";
import DateHelper from "@/services/date.helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const { employee_id, year, month, roles } = await request.json();

      const staff = await prisma.employee.findFirst({
         where: {
            id: employee_id
         },
         select: {
            staff: {
               where: {
                  AND: [{
                     begin_date: {
                        lt: new Date(year, month-1, 1)
                     }
                  },
                  {
                     OR: [
                        {
                           end_date: null
                        },
                        {
                           end_date: {
                              gte: new Date(year, month, 0)
                           }
                        }
                     ]
                  }]
               },
               select: {
                  id: true,
                  begin_date: true,
                  end_date: true
               }
            }
         }
      });

      const staff_id = staff?.staff[0].id;
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
                        id: true,
                        rate: {
                           select: {
                              id: true,
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

      const division_id = items?.rate.division.id??0;
      const staffs = items?.rate.division.rate.map(i => i.staff).filter(i => i.length > 0).map(i => i[0])
         .filter(i => isMasterRole ? true : i.id === staff_id);

      const calendarRows = await CalendarHelper.prepareCalendarData(division_id, year, month);

      let result = [];
      if (staffs) {
         for (const staff of staffs) {
            const item = calendarRows.filter(i => i.rate_id === staff.rate_id)[0];
            if (item)
               result.push(item)
         }
      }

      //const 


      return await NextResponse.json({status: 'success', data: {items: result}});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
