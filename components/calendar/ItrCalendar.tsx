'use client'
import React, {useRef, useState, useEffect, cache} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar } from "@/models/ICalendar";

const ItrCalendar = ({year, month, division_id}: {year: number, month: number, division_id: number}) => {
   const toast = useRef<Toast>(null);
   const [data, setData] = useState<ICalendar>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      getCalendarData();
   }, [year, month, division_id]);

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
            division: division_id, 
            year: year, 
            month: month}),
         cache: 'force-cache'
      });
      const data = await res.json();
      setData(data.data);
      setIsLoaded(false);
   }

   //@ts-ignore
   if (data === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   return (
      <React.Fragment>         
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <div className={classNames("flex justify-content-center", styles.calendarHeader)}>
                  <div className={classNames("flex align-items-center justify-content-center w-8rem font-bold", styles.cellHeader, styles.cellBl, styles.cellBt, styles.cellBr)}>
                     {data?.header?.name}
                  </div>
                  {
                     data?.header?.days?.map((day) => {                        
                        return (
                           <div key="calendar-header" className={classNames("flex align-items-center justify-content-center font-bold", styles.dataCell, styles.cellBt, styles.cellBr)}>
                              {day}
                           </div>
                        )
                     })
                  }
                  <div className={classNames("flex align-items-center justify-content-center w-4rem font-bold", styles.cellHeader, styles.cellBr, styles.cellBt)}>
                     {data?.header?.hours}
                  </div>
                  <div className={classNames("flex align-items-center justify-content-center w-6rem font-bold", styles.cellHeader, styles.cellBr, styles.cellBt)}>
                     {data?.header?.total}
                  </div>
               </div>
               {
                  data?.rows?.map((row) => {
                     return (
                        <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
                           <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
                           {
                              row?.cells?.map((day) => {
                                 let cellClass = styles.dataCell;
                                 switch (day.type) {
                                    case 0: cellClass = styles.cell0; break;
                                    case 1: cellClass = styles.cell1; break;
                                    case 2: cellClass = styles.cell2; break;
                                    case 3: cellClass = styles.cell3; break;
                                    case 4: cellClass = styles.cell4; break;
                                    case 5: cellClass = styles.cell5; break;
                                    case 6: cellClass = styles.cell6; break;
                                    case 7: cellClass = styles.cell7; break;
                                    case 8: cellClass = styles.cell8; break;
                                    case 9: cellClass = styles.cell9; break;
                                    case 10: cellClass = styles.cell10; break;
                                 }
                                 return (
                                    <div key="calendar-row" className={classNames("flex align-items-center justify-content-center w-4rem font-bold", styles.dataCell, cellClass)}>{day.hours}</div>
                                 )
                              })
                           }
                           <div className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.hours}</div>
                           <div className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.total?.toLocaleString()}</div>
                        </div>
                     )
                  })
               }
               <div className={classNames("flex justify-content-center", styles.calendarFooter)}>
                  <div className={classNames("flex vertical-align-middle w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl, styles.cellBb, styles.cellBr, styles.calendarLeftCell)}>
                     {data?.footer?.name}
                  </div>
                  {
                     data?.footer?.hours?.map((day) => {
                        return (
                           <div key="calendar-footer" className={classNames("flex align-items-center justify-content-center font-bold", styles.dataCell, styles.cellBr, styles.cellBb, styles.cellVertical)}>
                              {day}
                           </div>
                        )
                     })
                  }
                  <div className={classNames("w-4rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
                     {data?.footer?.sum?.toLocaleString()}
                  </div>
                  <div className={classNames("w-6rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
                     {data?.footer?.total?.toLocaleString()}
                  </div>
               </div>
            </div>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
