import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   const { division_id } = await request.json();
   try {
      // Все ставки
      const stuffs = await prisma.stuff_unit.findMany({
         where: {
            division_id: division_id
         },
         include: {
            post: {
               select: {
                  id: true,
                  name: true
               }
            }
         }
      });
      
      const result = [];
      let _id = -1;
      for (const item of stuffs) {
         const result_items = await prisma.state_unit.findMany({
            where: {
               stuff_unit_id: item.id
            },
            include: {
               employee: {
                  select: {
                     id: true,
                     name: true,
                     surname: true,
                     pathname: true
                  }
               }
            }
         })         

         for (const result_item of result_items) {
            const _item = {
               id: result_item.id,
               stuff_unit_id: result_item.stuff_unit_id,
               post: {
                  id: item.post.id,
                  name: item.post.name,
               },
               employee: {
                  id: result_item.employee.id,
                  name: `${result_item.employee.surname} ${result_item.employee.name} ${result_item.employee.pathname}`
               }
            }
            result.push(_item);
         }
         
         const count = result_items.length;         
         for (let i = count; i < item.count; i++) {
            const fake_item = {
               id: _id--,
               stuff_unit_id: item.id,
               post: {
                  id: item.post.id,
                  name: item.post.name,
               },
            }
            result.push(fake_item);
         }
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error });
   }
}