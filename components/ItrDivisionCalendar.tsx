'use client'
import styles from "@/app/(main)/workplace/department/projectcalendar/styles.module.scss";
import { ICalendarRow } from "@/models/ICalendar";
import { CalendarCellEventCallback } from "@/types/CalendarCellEventCallback";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import ItrMonthCalendar from "./calendar/ItrMonthCalendar";

const ItrStaffCalendar = ({year, month, user_id, needReload, dayClick}:{year: number, month: number, user_id: number, needReload: boolean, dayClick: CalendarCellEventCallback}) => {
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [data, setData] = useState<ICalendarRow[]>([]);

   useEffect(() => {
      setData([]);
      getCalendarData().then(i => {
         rebase(i);         
         setData(i);
      });
   }, [year, month, needReload])

   const getCalendarData = async () => {
      setIsLoaded(true);
      const res = await fetch(`/api/calendar/department/month`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            user_id: user_id,
            year: year,
            month: month}),
         cache: 'force-cache'
      });
      const response = await res.json();
      return response.data.items;
   }

   const rebase = (list: ICalendarRow[]) => {
      const firstDay = new Date(year, month-1, 1);
      const dayOfWeek = firstDay.getDay();
      const before = dayOfWeek == 0 ? 6 : dayOfWeek -1;
      const lastDay = new Date(year, month, 0);
      const after = 7 - lastDay.getDay();
      for (const row of list) {
         if (row.cells) {
            let n = new Date(year, month-1, 0).getDate();
            for (let i = 0; i < before; i++) {
               row.cells.unshift({day: n, type: 100, hours: 0, checked: false});
               n--;
            }
            for (let i = 1; i <= after; i++) {
               row.cells.push({day: i, type: 100, hours: 0, checked: false});
            }
         }
      }
   }

   return (
      <div className={classNames("justify-content-center flex-wrap container", styles.monthContainer)}>
         {            
            data.map((calendar) => <ItrMonthCalendar key={`rate-id-${calendar.rate_id}`} month={month} data={calendar} dayClick={dayClick}/>)
         }
      </div>
   );
};

export default ItrStaffCalendar;
