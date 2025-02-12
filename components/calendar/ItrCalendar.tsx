'use client'
import React, {useRef, useState, useEffect} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar } from "@/models/ICalendar";
import ItrCalendarRow from "./ItrCalendarRow";
import ItrCalendarHeader from "./ItrCalendarHeader";
import ItrCalendarFooter from "./ItrCalendarFooter";

interface Exclusion {
   value: number,
   name: string
}

const ItrCalendar = ({year, month, division_id, refresh}:{year: number, month: number, division_id: number, refresh: boolean}) => {
   const toast = useRef<Toast>(null);
   const [calendarData, setCalendarData] = useState<ICalendar>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      getCalendarData();
   }, [year, month, division_id, refresh]);

   const getCalendarData = async () => {
      if (!division_id) {
         toast.current?.show({severity:'error', summary: 'Сессия приложения', detail: 'Идентификатор подразделения недоступен!', life: 3000});
         return;
      }
      setIsLoaded(true);
      const res = await fetch(`/api/calendar/department/read`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            division_id: division_id, 
            year: year, 
            month: month}),
         cache: 'force-cache'
      });
      const response = await res.json();
      setCalendarData(response.data);
      setIsLoaded(false);
   }

   //@ts-ignore
   if (calendarData === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   return (
      <React.Fragment>         
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <ItrCalendarHeader header={calendarData?.header}/>               
               {
                  calendarData?.rows?.map((row, i) => {
                     const key = `calendar-row-${i}`
                     return <ItrCalendarRow key={key} row={row} index={i}/> 
                  })
               }
               <ItrCalendarFooter footerData={calendarData?.footer}/>
            </div>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
