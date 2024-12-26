import Vacations from "@/app/(main)/workplace/department/vacations/page";
import { ICalendarCell } from "@/models/ICalendar";
import prisma from "@/prisma/client";
//import { DateTime } from "luxon";

export interface IDateHours {
   date: Date,
   hours: number
}

export default class CalendarHelper {
// Количество рабочих часов на конкретную дату
   static hoursOfDay = async (date: Date): Promise<number> => {
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
         return (dayOfWeek === 6 || dayOfWeek === 0) ? 0 : 8;
      } else {
         let result = 0;
         switch (exclusion.exclusion_type) {
            case 1: result = 7; break;
            case 3: result = 8; break;
            case 4: result = 8; break;
            case 10: result = 8; break;
            default: result = 0; break;
         }
         return result;
      }
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
}