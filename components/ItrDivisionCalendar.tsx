'use client'
import { ICalendarRow } from "@/models/ICalendar";
import React, {useRef, useState, useEffect} from "react";
import ItrMonthCalendar from "./calendar/ItrMonthCalendar";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/ProjectCalendar/styles.module.scss"

const ItrStaffCalendar = ({year, month, user_id}:{year: number, month: number, user_id: number}) => {
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [data, setData] = useState<ICalendarRow[]>([]);

   useEffect(() => {
      getCalendarData().then(i => {
         rebase(i);
         setData(i);
      });
   }, [year, month])

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
               row.cells.unshift({day: n, type: 100, hours: 0});
               n--;
            }
            for (let i = 1; i <= after; i++) {
               row.cells.push({day: i, type: 100, hours: 0});
            }
         }
      }
   }

   return (
      <div className={classNames("card justify-content-center flex-wrap container mt-2", styles.monthContainer)}>
         {
            data.map((calendar) => <ItrMonthCalendar data={calendar}/>)
         }                     
      </div>
   );
};

export default ItrStaffCalendar;
