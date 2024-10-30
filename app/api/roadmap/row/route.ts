import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import DateHelper from "@/services/date.helpers";
import { IRoadmapItemSegment } from "@/models/IRoadmapItemSegment";

const palette = [
   "#0f2d5c",
   "#143d79",
   "#1b4b91",
   "#255ab2",
   "#316dca",
   "#4184e4",
   "#539bf5",
   "#6cb6ff",
   "#96d0ff",
   "#c6e6ff"
];

const BASE_COLOR = "#c9f2e6;"

export const POST = async (request: NextRequest) => {
   try {
      const { year, roadmap_id, project_id } = await request.json();

      const records = await prisma.roadmap_item.findMany({
         where: {
            roadmap_id: roadmap_id,
            project_id: project_id
         },
         select: {
            id: true,
            comment: true,
            start_date: true,
            end_date: true
         },
         orderBy: {
            start_date: 'asc'
         }
      });

      const data:IRoadmapItemSegment[] = records.map((item) => {
         return {
            id: item.id,
            name: item.comment,
            start_date: item.start_date,
            end_date: item.end_date,
            width: undefined,
            height: '32px',
            value: undefined,//DateHelper.numberDay(item.start_date),
            color: "#0f2d5c",
            percent: undefined
         }
      }).sort(function(a, b) {
         //@ts-ignore
         return a.start_date - b.start_date
      })

      // let _date = new Date(year, 0, 1);

      // const max_date = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      
      return await NextResponse.json({status: 'success', data: data});
   } catch (error: Error | unknown) {      
      return await NextResponse.json({status: 'error', data: (error as Error).message }); 
   }
}
