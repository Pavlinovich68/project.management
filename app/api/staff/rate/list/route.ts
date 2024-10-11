import { IBaseEntity } from "@/models/IBaseEntity";
import { IBaseDivision } from "@/models/IDivision";
import { IStaffRate } from "@/models/IStaff";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
   const url:URL = new URL(request.url);
   const id: number = Number(url.searchParams.get("id"));
   interface IStuffPostListItem {
      id: number,
      no: number,      
      post: {
         name: string
      }
   }
   try {
      const data: IStuffPostListItem[] | null = await prisma.rate.findMany({
         where: {
            division_id: id
         },
         select: {
            id: true,
            no: true,
            post: {
               select: {
                  name: true                  
               }
            }
         }
      });
      const result: IBaseEntity[] = data.map(item => {return {id: item.id, name: item.no + ' ' + item.post.name }});
      return NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return NextResponse.json({status: 'error', data: error });
   }
}