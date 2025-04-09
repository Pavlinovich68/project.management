'use client'
import React, {useRef, useState, useEffect} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar, ICalendarCell } from "@/models/ICalendar";
import ItrCalendarRow from "./ItrCalendarRow";
import ItrCalendarHeader from "./ItrCalendarHeader";
import ItrCalendarFooter from "./ItrCalendarFooter";
import { CalendarCellEventCallbackExt } from "@/types/CalendarCellEventCallbackExt";
import { useSession } from "next-auth/react";

const ItrCalendar = ({year, month, division_id, refresh, callback}:{year: number, month: number, division_id: number, refresh: boolean, callback: CalendarCellEventCallbackExt}) => {
   const toast = useRef<Toast>(null);
   const [calendarData, setCalendarData] = useState<ICalendar>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [flag, setFlag] = useState<boolean>(true);
   const [sumValue, setSumValue] = useState<number>(0);
   const [totalValue, setTotalValue] = useState<number>(0);
   const {data: session} = useSession();

   const spiner = (
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1'}}></i>
   )

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
      setSumValue(response.data.footer.sum);
      setTotalValue(response.data.footer.total);
      setIsLoaded(false);
   }

   //@ts-ignore
   if (calendarData === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   const event = (e: ICalendarCell, rate_id: number, is_clear: boolean, val: number) => {
      if (calendarData?.footer) {
         setSumValue(sumValue + val);
         setTotalValue(totalValue + val);
         const item = calendarData.footer.hours?.find(i => i.day === e.day)
         if (item){
            item.hours += val;
            setFlag(!flag);
         }
      }
      callback(e, rate_id, is_clear, val);
   }

   return (
      isLoaded ? spiner :
      <React.Fragment>     
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <ItrCalendarHeader header={calendarData?.header}/>               
               {
                  calendarData?.rows?.map((row, i) => {
                     const key = `calendar-row-${i}`
                     return <ItrCalendarRow key={key} row={row} index={i} year={year} month={month} callback={event}/>
                  })
               }
               <ItrCalendarFooter footerData={calendarData?.footer} flag={flag} sum={sumValue} total={totalValue}/>
            </div>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
