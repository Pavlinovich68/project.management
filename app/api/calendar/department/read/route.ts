import { ICalendar, ICalendarFooter, ICalendarHeader } from "@/models/ICalendar";
import { NextRequest, NextResponse } from "next/server";
import CalendarHelper from "@/services/calendar.helper";

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
   try {
      const { division_id, year, month } = await request.json();
// Получаем сетку календаря
      const calendarRows = await CalendarHelper.prepareCalendarData(division_id, year, month);
// Готовим шапку календаря
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const daysList = [...CalendarHelper.numberGenerator(lastDayOfMonth)]
      const calendarHeader: ICalendarHeader = { name: 'Фамилия', days: daysList, hours: 'Всего', total: 'От начала' }
      
      const footerValues: number[] = [];
      for (const day of daysList) {
         let columnValue: number = 0;
         for (const row of calendarRows) {
            columnValue += row.cells?.find(i => i.day === day)?.hours??0;
         }
         footerValues.push(columnValue);
      }

      let sum: number = 0;
      let total: number = 0;
      for (const row of calendarRows){
         sum += row.hours;
         total += row.total ?? 0;
      }

      const calendarFooter: ICalendarFooter = {
         name: 'Итого:',
         hours: footerValues,
         sum: sum,
         total: total
      }

      const calendar: ICalendar = {
         year: year,
         month: month,
         header: calendarHeader,
         rows: calendarRows,
         footer: calendarFooter
      }
      return await NextResponse.json({status: 'success', data: calendar});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).message });
   }
}