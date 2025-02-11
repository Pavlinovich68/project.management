import Vacations from "@/app/(main)/workplace/department/vacations/page";
import { ICalendarBaseRow, ICalendarCell, ICalendarRow, ICalendarSum } from "@/models/ICalendar";
import prisma from "@/prisma/client";
import { exclusion } from "@prisma/client";
import DateHelper from "./date.helpers";
//import { DateTime } from "luxon";

export interface IDateHours {
   date: Date,
   hours: number
}

export interface IHoursAndType {
   hours: number,
   type: number
}

export default class CalendarHelper {
// Количество рабочих часов на конкретную дату
   static hoursOfDayExt = async (date: Date): Promise<IHoursAndType> => {
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
      const year = date.getFullYear();
      const exclusions = await prisma.production_calendar.findMany({
         where: {
            year: year
         },
         select: {
            exclusions: true
         }
      });
      // День недели
      const dayOfWeek = new Date(year, date.getMonth(), date.getDate()).getDay();      
      const exclusion = exclusions[0]?.exclusions.find(i => {
         const _year = i.date.getFullYear();
         const _month = i.date.getMonth();
         const _day = i.date.getDate();
         return _year === date.getFullYear() && 
            _month === date.getMonth() &&
            _day === date.getDate()
      });
      
      if (!exclusion) {
         return (dayOfWeek === 6 || dayOfWeek === 0) ? {type: 0, hours: 0} : {type: 4, hours: 8};
      } else {
         let _hours = 0;
         switch (exclusion.exclusion_type) {
            case 1: _hours = 7; break;
            case 3: _hours = 8; break;
            case 4: _hours = 8; break;
            case 10: _hours = 8; break;
            default: _hours = 0; break;
         }
         return {type: exclusion.exclusion_type, hours: _hours};
      }
   }

   static hoursOfDay = async (date: Date): Promise<number> => {
      const data = await this.hoursOfDayExt(date);
      return data.hours;
   }

// Количество рабочих часов между двумя датами
   static workingHoursBetweenDates = async (from: Date, to: Date | undefined | null): Promise<number> => {
      if (!from || !to) return 0;
      let currentDate = new Date(from);
      let hours: number = 0;
      while (currentDate <= to) {
         const cnt = await this.hoursOfDay(currentDate)
         hours += cnt;
         currentDate.setDate(currentDate.getDate() +1);         
      }
      return hours;
   } 

   static timeAvailable = async (year: number) => {
      if (year < new Date().getFullYear()) 
         return 0;
      if (year > new Date().getFullYear()) 
         return await this.workingHoursBetweenDates(new Date(year, 0, 1), new Date(year, 11, 31));
      return await this.workingHoursBetweenDates(new Date(), new Date(year, 11, 31));
   }

   static getDivisionHoursOfDate = async (division_id: number, date: Date): Promise<number> => {
      const hours = await this.hoursOfDay(date);
      const _date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.abs(new Date().getTimezoneOffset())/60);
      // Если выходной то 0 независимо от количества ставок      
      if (hours === 0) return 0;      
      const rateCaunt = await prisma.rate.count({where: {division_id: division_id}});
      const vacationCount = await prisma.vacation.count({
         where: {
            AND: [
               {
                  staff: {
                     rate: {
                        division_id: division_id
                     }
                  }
               },
               {
                  start_date: {
                     lte: _date
                  }
               },
               {
                  end_date: {
                     gte: _date
                  }
               }
            ]            
         }
      });
      const result = (rateCaunt - vacationCount) * hours;      
      return result;
   }
//NOTE - Дефицит рабочего времени на конкретную дату
   static getVacancyHoursOnDate = async (division_id: number, date: Date): Promise<number> => {
      const hours = await this.hoursOfDay(date);      
      // Если выходной то 0 независимо от количества ставок      
      if (hours === 0) return 0;
      const _date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.abs(new Date().getTimezoneOffset())/60);
      const vacancyCount = await prisma.staff.count({
         where: {
            AND: [
               {
                  rate: {
                     division_id: division_id
                  }
               },
               {
                  OR: [
                     {
                        end_date: {
                           lte: _date
                        }
                     },
                     {
                        begin_date: {
                           gt: _date
                        }
                     }
                  ]
               }
            ]            
         }
      });
      const result = vacancyCount * hours;
      return result;
   }

   static vacancyHours = async (division_id: number, year: number): Promise<number> => {
      const to = new Date(year, 11, 31)
      let currentDate = new Date(year, 0, 1);      
      let hours: number = 0;
      while (currentDate <= to) {
         const cnt = await this.getVacancyHoursOnDate(division_id, currentDate)
         hours += cnt;
         currentDate.setDate(currentDate.getDate() +1);         
      }
      return hours;
   } 

// Количество рабочих часов между двумя датами
   static getDivisionHoursBetweenDates = async (division_id: number, from: Date, to: Date | undefined | null): Promise<number> => {
      if (!from || !to) return 0;
      let currentDate = new Date(from);
      let hours: number = 0;
      while (currentDate <= to) {
         const cnt = await this.getDivisionHoursOfDate(division_id, currentDate);
         hours += cnt;
         currentDate.setDate(currentDate.getDate() +1);
      }
      return hours;
   }   
   
   // Количество рабочи часов по конкретной штатной еденице
   static staffHours = async (staffId: number | null | undefined, from: Date, to: Date):Promise<number> => {
      let currentDate = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0,0,0,0);      
      const result: number[] = [];
      const maxDate = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 0, 0, 0, 0);
      const _staff = await prisma.staff.findUnique({where: { id: staffId??-1 }});
      const staffBeginDate = _staff?.begin_date ? new Date(_staff.begin_date.getFullYear(), _staff.begin_date.getMonth(), _staff.begin_date.getDate(), 0,0,0,0) : new Date(0,0,0,0,0,0,0);
      const staffEndDate = _staff?.end_date ? new Date(_staff.end_date.getFullYear(), _staff.end_date.getMonth(), _staff.end_date.getDate(), 0,0,0,0) : null;

      while (currentDate <= maxDate) {
         //Проверяем на действительность ставки         
         let item: number = 0;
         if (!_staff || staffBeginDate > currentDate || (staffEndDate && staffEndDate < currentDate)) {
            // Если ставка вакантна
            item = 0;
         } else {            
            const _cellItem = await prisma.dept_calendar_cell.findFirst({
               where: {
                  row: {
                     rate_id: _staff.rate_id,
                     calendar: {
                        year: currentDate.getFullYear()
                     }
                  },
                  month: currentDate.getMonth() +1,
                  day: currentDate.getDate()
               }
            });
            
            if (_cellItem) {
               // Если есть исключение - подставляем исключение
               item = _cellItem.hours
            } else {
               // Базовое значение из производственного календаря
               let _item = await CalendarHelper.hoursOfDayExt(currentDate);
               item = _item.hours;
            }
         }
         result.push(item);
         currentDate.setDate(currentDate.getDate() + 1);
      }
      return result.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
   }

   static *numberGenerator(n: number): Generator<number> {
      for (let i = 1; i <= n; i++) {
         yield i;
      }
   }

   static getDatesBetween = (startDate: Date, endDate: Date, month: number) => {
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

   static prepareCalendarData = async (division_id: number, year: number, month: number): Promise<ICalendarRow[]> => {
      const firstMonthDay = new Date(year, month-1, 1);
      const lastMonthDay = new Date(year, month, 0);
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
      baseCells = baseCells.sort(function(a, b) { return a.day - b.day });
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

      const daysArray = [...this.numberGenerator(lastMonthDay.getDate())];

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
            days: this.getDatesBetween(i.start_date, i.end_date, month)
         }
      });
//#endregion
//NOTE - Итоги от начала года
//#region
      const accumulator = await this.getAccumulatorValues(division_id, year, month);
//#endregion
//NOTE - Выходная модель
//#region
      const grid: ICalendarRow[] = [];
      for (const _row of rowNames) {
         const row: ICalendarRow = await this.getCalendarRow(
            year,
            month,
            _row, 
            baseCells, 
            personalExclusions?.rows.find(i => i.rate_id === _row.rate_id)?.cells ?? [],
            vacanciesDays[_row.rate_id],
            vacations.find(i => i.rate_id === _row.rate_id)?.days ?? [],
            (accumulator?.find(i => i.rate_id === _row.rate_id))?.sum??0
         )
         grid.push(row)
      }
//#endregion
      return grid;
   }

   static getAccumulatorValues = async (division_id: number, year: number, month: number): Promise<ICalendarSum[] | undefined> => {
      const data = await prisma.acc_hours.groupBy({
         by: ['rate_id'],
         where: {
            year: year,
            month: month -1,
            rate: {
               division_id: division_id
            }
         },
         _sum: {
            value: true
         }
      })
      const result: ICalendarSum[] = data.map(i => {
         return {
            rate_id: i.rate_id,
            sum: i._sum.value
         }
      });
      return result;
   }

   static getCalendarRow = async (
         year: number,
         month: number,
         baseRow: ICalendarBaseRow, // rate_id и имя ставки
         baseCells: ICalendarCell[], // часы в соответствии с производственным календарем
         exclusions: ICalendarCell[], // персональные исключения 
         vacancyDays: number[], // дни вакансии
         vacationDays: number[], // дни отпуска
         total: number
      ): Promise<ICalendarRow> => 
   {
      // Накладываем отпуска
      for (let day of vacationDays) {
         let item = baseCells.find(i => i.day === day);
         if (item) {
            item.type = 5;
            item.hours = 0;
         }
      }
      // Накладываем персональные исключения
      for (let exclusion of exclusions) {
         let item = baseCells.find(i => i.day === exclusion.day);
         if (item) {
            item.type = exclusion.type;
            item.hours = exclusion.hours;
         }
      }
      // Накладываем вакансии
      if (vacancyDays) {
         for (let vacancy of vacancyDays) {
            let item = baseCells.find(i => i.day === vacancy);
            if (item) {
               item.type = 9;
               item.hours = 0;
            }
         }
      }
      // Подводим итог по месяцу
      const rowSum = baseCells.reduce((acc, val) => acc + val.hours, 0);
      // Итог
      const result: ICalendarRow = {
         rate_id: baseRow.rate_id,
         name: baseRow.name,
         cells: baseCells,
         hours: rowSum,
         total: total
      }

      const currentMonth = new Date().getMonth();
      if (month == currentMonth) {
         result.total = result.hours;
      } else
      if (month < currentMonth) {
         result.total = total;
      } else {
         result.total = 0;
      }
      return result;
   }
}