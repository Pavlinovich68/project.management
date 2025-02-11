import { ICalendar, ICalendarCell, ICalendarFooter, ICalendarRow } from "@/models/ICalendar";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import StringHelper from '@/services/string.helper';
import CalendarHelper from "@/services/calendar.helper";
import { it } from "node:test";
import DateHelper from "@/services/date.helpers";
import { start } from "repl";
import ItrCalendarRow from "@/components/calendar/ItrCalendarRow";

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

/*
1. Вытянуть в память из производственного календаря все исключения за месяц
2. Построить словарь где ключ это день месяца а значение это количество часов
3. Итоги от начала года расчитывать за предидущие месяца при первом обращении и расчитываьб при первом обращении
*/

export const POST = async (request: NextRequest) => {

   function* numberGenerator(n: number): Generator<number> {
      for (let i = 1; i <= n; i++) {
         yield i;
      }
   }

   const rowCells = async (staffId: number | null | undefined, year: number, month: number):Promise<ICalendarCell[]> => {
      let currentDate = new Date(year, month-1, 1, 0,0,0,0);      
      const result: ICalendarCell[] = [];      
      const maxDate = new Date(year, month, 0);
      const _staff = await prisma.staff.findUnique({where: { id: staffId??-1 }});
      const staffBeginDate = _staff?.begin_date ? new Date(_staff.begin_date.getFullYear(), _staff.begin_date.getMonth(), _staff.begin_date.getDate(), 0,0,0,0) : new Date(0,0,0,0,0,0,0);
      const staffEndDate = _staff?.end_date ? new Date(_staff.end_date.getFullYear(), _staff.end_date.getMonth(), _staff.end_date.getDate(), 0,0,0,0) : null;

      while (currentDate <= maxDate) {
         //Проверяем на действительность ставки         
         let item: ICalendarCell = {id: 0, day: currentDate.getDate(), hours: 0, type: 0 };
         if (!_staff || staffBeginDate > currentDate || (staffEndDate && staffEndDate < currentDate)) {
            // Если ставка вакантна
            item.type = 9
         } else {            
            const _day = currentDate.getDate();
            const _cellItem = await prisma.dept_calendar_cell.findFirst({
               where: {
                  row: {
                     rate_id: _staff.rate_id,
                     calendar: {
                        year: year
                     }
                  },
                  month: month,
                  day: _day,
               }
            });
            if (_cellItem) {
               // Если есть исключение - подставляем исключение
               item.type = _cellItem.type,
               item.hours = _cellItem.hours
            } else {
               // Базовое значение из производственного календаря
               let _item = await CalendarHelper.hoursOfDayExt(currentDate);
               item.type = _item.type;
               item.hours = _item.hours;
            }
         }
         result.push(item);
         currentDate.setDate(currentDate.getDate() + 1);
      }
      return result;
   }

   try {
      const { division_id, year, month } = await request.json();

      const grid = await CalendarHelper.prepareCalendarData(division_id, year, month);
      return await NextResponse.json(grid);      
// Календарь
      const _calendar = await prisma.dept_calendar.findFirst({
         where: {
            year: year,
            division_id: division_id
         }
      });

      if (!_calendar)
         return await NextResponse.json({status: 'error', data: "Календарь не обнаружен!" });
// Колонки
      const dayCount = new Date(year, month, 0).getDate();
      const dayArray = Array.from(Array(dayCount+1).keys()).filter(i => i>0);
// Выходная модель
      const result: ICalendar = {
         year: year,
         month: month,
         header: { name: 'Фамилия', days: dayArray, hours: 'Всего', total: 'От начала' },
         rows: [],
         footer: undefined
      }
// Выбираем ставки подразделения
      const _rows = await prisma.dept_calendar_row.findMany({
         where: {
            calendar_id: _calendar.id
         },
         orderBy: {
            rate: {
               no: 'asc'
            }
         }
      });

      const lastDay = new Date(year, month, 0);
      for (const _row of _rows) {
         const _staff = await prisma.staff.findFirst({
            where: {
               AND: [
                  { rate_id: _row.rate_id },
                  { begin_date: { lte: lastDay } },
                  { OR: [
                     {
                        end_date: null
                     },
                     {
                        end_date: { gte: lastDay }
                     }
                  ]}
               ]
            },
            include: {
               employee: true
            }
         });
         
         // Наименование строки
         let _rowHeader = undefined;
         if (_staff) {
            const _employee = await prisma.employee.findFirst({ where: {id: _staff.employee_id } });
            if (_employee) {
               _rowHeader = StringHelper.fullNameTransform(_employee.name);
            } else {
               _rowHeader = 'Вакансия';
            }
         } else {
            _rowHeader = 'Вакансия';            
         }
         // Создаем и заполняем массив по дням
         const cells = await rowCells(_staff?.id, year, month);
         const _sum = cells.map(i => i.hours).reduce((part, a) => part + a, 0);
         
         const _total = await CalendarHelper.staffHours(_staff?.id, new Date(year, 0, 1), lastDay);
         
         const row: ICalendarRow = {
            name: _rowHeader,
            cells: cells,
            hours: _sum,
            total: _total
         }

         result.rows?.push(row);
      }
      
      const _footer: ICalendarFooter = {name: 'Итого', hours: [], sum: undefined, total: 0};

      for (const _day of dayArray) {
         const _sum = await prisma.dept_calendar_cell.aggregate({
            where: {
               day: _day,
               month: month,
               row: {
                  calendar: {
                     division_id: division_id,
                     year: year
                  }
               }
            },
            _sum: {
               hours: true
            }
         });

         _footer.hours?.push({day: _day, hours: _sum._sum.hours??0});
      }

      _footer.sum = _footer.hours?.reduce((item, a) => item + a.hours, 0);
      _footer.total = 0;
      for (const _row of result.rows??[]) {
         _footer.total += _row.total??0;
      }
      result.footer = _footer;
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}