import { ICellDictionary } from "@/models/ICalendar";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
// 0  - holiday            Выходной или праздничный   0
// 1  - reduced            Предпраздничный            7
// 2  - holiday transfer   Перенесенный выходной      0
// 3  - worked transfer    Перенесенный рабочий       8
// 4  - worked             Рабочий                    8
// 5  - vacation           Отпуск                     0
// 6  - hospital           Больничный                 0
// 7  - without pay        Без содержания             0
// 8  - absense from work  Прогул                     0
// 9  - vacancy            Вакансия                   0
// 10 - work on weekends   Работа в выходной          8
   try {
      const req: any = await request.json();
      const values = req.values 

      for (const [key, value] of Object.entries(values)) {
         let _hours = 0;
         switch (value as number) {
            case 1: _hours = 7; break;
            case 3: _hours = 8; break;
            case 4: _hours = 8; break;
            case 10: _hours = 8; break;
         }
         const id = Number(key);
         await prisma.dept_calendar_cell.update({
            where: {
               id: id
            },
            data: {
               type: Number(value),
               hours: _hours
            }
         })
      }
      
      return await NextResponse.json({status: 'success', data: true});      
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}