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

   const getDatesBetween = (startDate: Date, endDate: Date, month: number) => {
      const dates = [];
      let currentDate = new Date(startDate);
      // Убедимся, что конечная дата больше начальной
      while (currentDate <= endDate) {
         if (new Date(currentDate).getMonth()+1 === month)
         dates.push(new Date(currentDate).getDate());
         currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
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
      const firstMonthDay = new Date(year, month-1, 1);
      const lastMonthDay = new Date(year, month, 0);

      const rateTotalHours = async (rate_id: number, currentSum: number): Promise<number> => {
         // Если январь то нарастающий итог совпадает с итогом за месяц
         if (month === 1) return currentSum;
         // Берем нарастающий итог за предшествующий месяц
         const accItem = await prisma.acc_hours.findFirst({
            where: {
               rate_id: rate_id,
               year: year,
               month: month-1
            }
         });
         const storedValue = accItem?.value;
         // Если значение не найдено значит месяц еще не настал либо значение еще не было расчитано.
         if (!storedValue) {
            // Если месяц еще не настал
            if (month > new Date().getMonth()+1) {
               // Вытаскиваем то что есть сохраненное, остальное по производственному календарю
            } else {
               // Берем за предшествующий месяц, сохраняем и возвращаем
            }

            return 0;
         } else
            return storedValue + currentSum;
      }

//NOTE - Рабочие часы по графику в соответствии с производственным календарем
//#region
      const monthCalendarExclusionsQuery = await prisma.production_calendar.findFirst({
         where: {
            year: year
         },
         select: {
            exclusions: {
               where: {
                  AND: [
                     {
                        date: {
                           gte: firstMonthDay
                        }
                     },
                     {
                        date: {
                           lte: lastMonthDay
                        }
                     }
                  ]
               }
            }
         }
      });

      let baseCells: ICalendarCell[] = [];
      if (monthCalendarExclusionsQuery?.exclusions) {
         for (let item of monthCalendarExclusionsQuery?.exclusions) {
            const day = item.date.getDate();
            let hours = 0;
            switch (item.exclusion_type) {
               case 1: hours = 7; break;
               case 3: hours = 8; break;
               case 10: hours = 8; break;
            }
            baseCells.push({day: day, type: item.exclusion_type, hours: hours});
            //monthHours[day] = hours;
         }
      }

      for (let i = 1; i <= lastMonthDay.getDate(); i++) {
         if (baseCells.find((_cell) => _cell.day === i) === undefined) {
            const dayOfWeek = new Date(year, month -1, i).getDay();
            baseCells.push({day: i, type: (dayOfWeek === 6 || dayOfWeek === 0) ? 0 : 4, hours: (dayOfWeek === 6 || dayOfWeek === 0) ? 0 : 8});
         }
      }
      baseCells = baseCells.sort(function(a, b) { return a.day - b.day })
//#endregion
//NOTE - Персональные исключения из рабочего графика
//#region
      const personalExclusions = await prisma.dept_calendar.findFirst({
         where: {
            division_id: division_id,
            year: year
         },
         select: {
            rows: {
               select: {
                  rate_id: true,
                  cells: {
                     where: {
                        month: month
                     },
                     select: {
                        day: true,
                        type: true,
                        hours: true
                     },
                     orderBy: {
                        day: 'asc'
                     }
                  }
               },
               orderBy: {
                  no: 'asc'
               }
            }
         }
      })
//#endregion
//NOTE - Разработчики по состоянию на текущий день либо на последний день месяца (первая колонка)
//#region
      const currentDay = month === new Date().getMonth()+1 ? DateHelper.toUTC(new Date()) : DateHelper.toUTC(new Date(year, month, 0));

      const rates = await prisma.rate.findMany({
         where: {
            division_id: division_id
         },
         select: {
            id: true,
            staff: {
               where: {
                  begin_date: {
                     lt: currentDay
                  },
                  OR: [
                     {
                        end_date: null
                     },
                     {
                        end_date: {
                           gte: currentDay
                        }
                     }
                  ]
               },
               select: {
                  employee: {
                     select: {
                        name: true
                     }
                  }
               }
            }
         },
         orderBy: {
            no: 'asc'
         }
      });

      const rowNames = rates.map((i) => {
         return {
            rate_id: i.id,
            name: i.staff[0] ? i.staff[0].employee.name : 'Вакансия'
         }
      });
//#endregion      
//NOTE - Вакансии
//#region
      const vacanciesData = (await prisma.rate.findMany({
         where: {
            division_id: division_id
         },
         select: {
            id: true,
            staff: {
               where: {
                  OR: [
                     {
                        AND: [
                           {
                              begin_date: {
                                 gt: firstMonthDay
                              }
                           },
                           {
                              begin_date: {
                                 lt: lastMonthDay
                              }
                           }
                        ]                        
                     },
                     {
                        AND: [
                           {
                              end_date: {
                                 lt: lastMonthDay
                              }
                           },
                           {
                              end_date: {
                                 gt: firstMonthDay
                              }
                           }
                        ]                        
                     },
                     {
                        end_date: {
                           lt: firstMonthDay
                        }
                     },
                     {
                        begin_date: {
                           gt: lastMonthDay
                        }
                     }
                  ]
               },
               select: {
                  begin_date: true,
                  end_date: true
               }
            }
         }
      })).filter(i => i.staff.length > 0);

      const daysArray = [...numberGenerator(lastMonthDay.getDate())];

      const vacanciesDays: {[key: number]: number[]} = {};
      for (let _rate of vacanciesData) {
         let _rateDays: number[] = daysArray;
         for (let _staff of _rate.staff) {
            let _begin_date = DateHelper.toUTC(_staff.begin_date < firstMonthDay ? firstMonthDay : _staff.begin_date);
            let _end_date = DateHelper.toUTC((_staff.end_date??lastMonthDay) >= lastMonthDay ? lastMonthDay : (_staff.end_date??lastMonthDay));            
            let _iterate_day = _begin_date            
            while (_iterate_day <= _end_date) {
               const _day = _iterate_day.getDate();
               _rateDays = _rateDays.filter(num => num !== _day);
               _iterate_day.setDate(_iterate_day.getDate() + 1)
            }            
         }
         vacanciesDays[_rate.id] = _rateDays;
      }
//#endregion
//NOTE - Отпуска
//#region
      const vacationsQuery = await prisma.vacation.findMany({
         where: {
            year: year
         },
         select: {
            start_date: true,
            end_date: true,
            staff: {
               select: {
                  rate: true
               }
            }
         }
      });

      const vacations = vacationsQuery.map((i) => {
         return {
            start_date: i.start_date,
            end_date: i.end_date,
            start_month: i.start_date.getMonth() +1,
            end_month: i.end_date.getMonth() +1,
            rate_id: i.staff?.rate.id,
            division_id: i.staff?.rate.division_id
         }
      }).filter((i) => (i.start_month === month || i.end_month === month) && i.division_id === division_id).map((i) => {
         return {
            rate_id: i.rate_id,
            days: getDatesBetween(i.start_date, i.end_date, month)
         }
      });
//#endregion
//NOTE - Выходная модель
//#region
   const grid: ICalendarRow[] = [];
   for (const _row of rowNames) {
      const rowICalendar: ICalendarRow = {
         rate_id: _row.rate_id,
         name: _row.name,
         cells: baseCells,
         hours: baseCells.reduce((acc, curr) => acc + curr.hours, 0),
         total: 0
      }
      grid.push(rowICalendar)
   }
//#endregion
//NOTE - Заполняю строки   
   //return await NextResponse.json(Object.keys(monthHours).map((key, value) => key));
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