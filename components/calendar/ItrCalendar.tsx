'use client'
import React, {useRef, useState, useEffect, cache} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar } from "@/models/ICalendar";

const ItrCalendar = ({year, month, division_id}: {year: number, month: number, division_id: number}) => {
   const toast = useRef<Toast>(null);
   const [data, setData] = useState<ICalendar>();

   useEffect(() => {
      getCalendarData();
   }, [year, month, division_id]);

   const getCalendarData = async () => {
      if (!division_id) {
         toast.current?.show({severity:'error', summary: 'Сессия приложения', detail: 'Идентификатор подразделения недоступен!', life: 3000});
         return;
      }
      const res = await fetch(`/api/calendar/department/read`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            division: division_id, 
            year: year, 
            month: month}),
         cache: 'force-cache'
      });
      const data = await res.json();
      setData(data.data);
   }

   return (
      <React.Fragment>
         <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
            <div className={classNames("flex justify-content-center", styles.calendarHeader)}>
               <div className={classNames("flex align-items-center justify-content-center w-8rem font-bold cell-bl cell-bt", styles.cellHeader)}>
                  {data?.header?.name}
               </div>
               {
                  data?.header?.days?.map((day) => {
                     return (
                        <div key="calendar-header" className={classNames("flex align-items-center justify-content-center font-bold cell-bt", styles.dataCell)}>
                           {day}
                        </div>
                     )
                  })
               }
               <div className={classNames("flex align-items-center justify-content-center w-4rem font-bold cell-br cell-bt", styles.cellHeader)}>
                  {data?.header?.hours}
               </div>
               <div className={classNames("flex align-items-center justify-content-center w-6rem font-bold cell-br cell-bt", styles.cellHeader)}>
                  {data?.header?.total}
               </div>
            </div>
            {
               data?.rows?.map((row) => {
                  return (
                     <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
                        <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2 cell-bl", styles.cellHeader)}>{row.name}</div>
                        {
                           row?.cells?.map((day) => {                                                            
                              return (
                                 <div key="calendar-row" className={classNames("flex align-items-center justify-content-center w-4rem font-bold", styles.dataCell)}>{day.hours}</div>
                              )
                           })
                        }
                        <div className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold cell-br", styles.cellHeader)}>{row.hours}</div>
                        <div className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold cell-br", styles.cellHeader)}>{row.total?.toLocaleString()}</div>
                     </div>
                  )
               })
            }
            <div className={classNames("flex justify-content-center", styles.calendarHeader)}>
               <div className={classNames("flex vertical-align-middle w-8rem font-bold pl-2 calendar-left-cell cell-bl cell-bl cell-bb cell-br")}>
                  {data?.footer?.name}
               </div>
               {
                  data?.footer?.hours?.map((day) => {
                     return (
                        <div key="calendar-footer" className={classNames("flex align-items-center justify-content-center font-bold, cell-vertical cell-br cell-bb", styles.dataCell)}>
                           {day}
                        </div>
                     )
                  })
               }
               <div className={classNames("w-4rem font-bold pr-2 calendar-left-cell text-right cell-br cell-bb")}>
                  {data?.footer?.sum?.toLocaleString()}
               </div>
               <div className={classNames("w-6rem font-bold pr-2 calendar-left-cell text-right cell-br cell-bb")}>
                  {data?.footer?.total?.toLocaleString()}
               </div>
            </div>
         </div>
         <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
