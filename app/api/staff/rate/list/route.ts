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
      const all: IBaseEntity[] = data.map(item => {return {id: item.id, name: item.no + ' ' + item.post.name }});

      const array1 = await prisma.staff.findMany({
         where: {
            rate: {
               division_id: id
            }
         },
         select: {
            rate: {
               select: {
                  id: true,
                  no: true,
                  post: true
               }
            }
         }
      })
      const array2 = array1.map(item => {return {id: item.rate.id, name: item.rate.no + ' ' + item.rate.post.name}});

      //@ts-ignore
      const filtered = all.map(i => i.id).filter(elem_A => !array2.map(i => i.id).includes(elem_A));
      const result = all.filter(i => {return filtered.includes(i.id)});

      return NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return NextResponse.json({status: 'error', data: error });
   }
}