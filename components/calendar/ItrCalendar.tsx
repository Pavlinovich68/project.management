'use client'
import React, {useRef, useState, useEffect, cache, SyntheticEvent, Ref, forwardRef} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar } from "@/models/ICalendar";
import { Session } from "next-auth";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Dropdown } from "primereact/dropdown";
import ItrCalendarRow from "./ItrCalendarRow";
import ItrCalendarHeader from "./ItrCalendarHeader";
import ItrCalendarFooter from "./ItrCalendarFooter";

interface Exclusion {
   value: number,
   name: string
}

const ItrCalendar = ({year, month, division_id, session, refresh, writeMode, dayType}: 
   {year: number, month: number, division_id: number, session: Session, refresh: boolean, writeMode: boolean, dayType: number | undefined}) => {
   const toast = useRef<Toast>(null);
   const [data, setData] = useState<ICalendar>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [cardHeader, setCardHeader] = useState<string>('');
   const [cardVisible, setCardVisible] = useState<boolean>(false);
   const [selectedExclusion, setSelectedExclusion] = useState<Exclusion | null>(null);
   const [selectedId, setSelectedId] = useState<number | undefined>(undefined);   

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
            division: division_id, 
            year: year, 
            month: month}),
         cache: 'force-cache'
      });
      const data = await res.json();
      setData(data.data);
      setIsLoaded(false);
   }

   const getCardHeader = async (id: number) => {
      const res = await fetch(`/api/calendar/department/cell_prop?id=${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
         cache: 'force-cache'
      });
      const data = await res.json();
      setSelectedExclusion(null);
      setCardHeader(`Исключение для ${data.data.name} на дату ${data.data.date}`);
   }

   const recalcFooter = (day: number, delta: number) => {
      console.log(day, delta);
      debugger;
      const item = data?.footer?.hours?.find((i) => i.day === day);
      if (item)
         item.hours - delta;
      if (data?.footer?.sum)
         data.footer.sum -= delta;
      if (data?.footer?.total)
         data.footer.total -= delta;

   }

   //@ts-ignore
   if (data === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   return (
      <React.Fragment>         
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <ItrCalendarHeader header={data?.header}/>               
               {
                  data?.rows?.map((row, i) => { return <ItrCalendarRow key={`row`} row={row} index={i} writeMode={writeMode} dayType={dayType} recalcFooter={recalcFooter}/> })
               }
               <ItrCalendarFooter footer={data?.footer}/>
            </div>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
