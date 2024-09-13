import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ICalendarHeader, ICalendarHeaderItem, ICalendarRow, ICalendarRowItem, ICalendarFooter, ICalendarData } from "@/types/ICalendarData";

export const POST = async (request: NextRequest) => {
   try {
      const { division_id, year, month } = await request.json();
      const cnt = new Date(year, month, 0).getDate();
      const days = Array.from(Array(cnt).keys());
// Базовое разделение на выходные и рабочие дни в соответствии с днем недели
      const daysData = [];
      for (let i = 0; i < days.length; i++) {
         const date = new Date(Date.UTC(year, month-1, i+1))
         const dayOfWeek = date.getDay();
         daysData.push({
            day: i+1,
            background_class: (dayOfWeek === 0 || dayOfWeek === 6)? 1 : 0,
            text_class: (dayOfWeek === 0 || dayOfWeek === 6)? 1 : 0,
            exclusion_type: (dayOfWeek === 0 || dayOfWeek === 6)? 0 : -1
         })
      }
      
// Исключения в соответствии с производственным календарем
      const exclusionData: [{day: number, exclusion_type: number}] = await prisma.$queryRaw`
         select
            extract(day from e.date)::int as day,
            e.exclusion_type
         from
            exclusion e
         where
            extract(year from e.date) = ${year}
            and extract(month from e.date) = ${month}
         order by
            e.date;
      `;
// Шапка      
      const headerData: ICalendarHeaderItem[] = daysData.map((i) => {
         const exclusion = exclusionData.find((item: any) => item.day === i.day);
         if (exclusion) { 
            switch (exclusion.exclusion_type) {
               case 0: {
                  i.background_class = 1;
                  i.text_class = 1;
                  break;
               }
               case 1: {
                  i.background_class = 2;
                  i.text_class = 2;
                  break;
               }
               case 2: {
                  i.background_class = 1;
                  i.text_class = 1;
                  break;
               }
               case 3: {
                  i.background_class = 0;
                  i.text_class = 0;
                  break;
               }
            }
            i.exclusion_type = exclusion.exclusion_type;
         }
         return {
            day: i.day,
            type: i.exclusion_type,
            background_class: i.background_class,
            text_class: i.text_class,
         };
      });

// Исключения в соответствии с графиком отпусков
      interface IDay {
         day: number;
      }
      const getMonthVacationDays = async (state_unit_id: number, year: number, month: number, dayCount: number): Promise<number[]> => {
         const result:IDay[] = await prisma.$queryRaw`
            select distinct q2.day from
               (select
                     extract(day from q.date) as day
                  from
                     (select
                           format('%s-%s-%s', ${year}, ${month}, month.day)::DATE as date
                     from
                           (select day.* from generate_series(1, ${dayCount}) as day) as month) q,
                           (select v.start_date::date, v.end_date::date from vacation v where v.state_unit_id = ${state_unit_id} and v.year = ${year} and (extract(month from v.start_date) = ${month} or extract(month from v.end_date) = ${month})) as q1
                  where
                     case when q.date between q1.start_date and q1.end_date then 1 else 0 end = 1) q2
            order by
               q2.day;
         `;
         return result?.map(i => i.day);
      }
         
      const data: ICalendarData = {
         header: {days: headerData},
         rows: undefined,
         footer: undefined,
      };

// Заполнение заголовка
      const rows: ICalendarRow[] = [];
      interface IDivisionData {
         id: number,
         employee: {
            surname: string,
            name: string,
            pathname: string
         }
      }
      const divisionPreData = await prisma.state_unit.findMany({         
         where: {
            stuff_unit: {
               division_id: division_id,
            }
         },
         select: {
            id: true,
            employee: {
               select: {
                  surname: true,
                  name: true,
                  pathname: true
               }
            }
         },
         orderBy: {
            employee: {
               surname: 'asc'
            }
         }
      });

      const divisionData = (divisionPreData as IDivisionData[]).map((i) => {
         return {
            id: i.id,
            name: i.employee.surname + ' ' + i.employee.name.charAt(0) + '.',
         }
      });

      const footer: ICalendarFooter = {days: [], total: 0};
      for (const dayItem of headerData) {
         let bkg = 'cell-gray';
         switch (dayItem.background_class) {
            case 1:
               bkg = 'cell-red'
               break;
            case 2:
               bkg = 'cell-pink'         
            default:
               break;
         }
         const day: ICalendarRowItem = {
            day: dayItem.day,
            value: 0,
            background_class: bkg,
            text_class: '',
         }
         footer.days.push(day);
      }

      for (const profile of divisionData){
         let profileRow: ICalendarRow = { name: profile.name, hours: [], total: 0 };
         const vacationDays: number[] = (await getMonthVacationDays(profile.id, year, month, cnt));
         for (const dayItem of headerData)  {            
            let isVacation = vacationDays.find((v_item) => Number(v_item) === Number(dayItem.day));
            let dayHours: number = 0;
            let bkg = 'cell-white';
            switch (dayItem.type) {
               case 0: {
                  dayHours = 0;
                  bkg = 'cell-red';
                  break;
               }
               case 1: {
                  bkg = 'cell-pink';
                  dayHours = isVacation ? 0 : 7;
                  break;
               }
               default: {
                  dayHours = isVacation ? 0 : 8;
                  break;
               }
            }

            let _item = footer.days.find((f_item: ICalendarRowItem) => f_item.day === dayItem.day);
            if (_item) _item.value += dayHours;

            profileRow.total += dayHours;
            const item: ICalendarRowItem = {day: dayItem.day, value: dayHours, background_class: isVacation ? "cell-yellow" : bkg, text_class: isVacation ? "textVacation" :''};
            profileRow.hours?.push(item);
         }
         rows.push(profileRow);  
      }

      let total = 0;
      footer?.days.map(i => { total += i.value });
      if (footer) footer.total = total;

      data.rows = rows;
      data.footer = footer;

      return await NextResponse.json({status: 'success', data: data});
   } catch (error:any) {
      return await NextResponse.json({status: 'error', data: error.meta.message });
   }
}