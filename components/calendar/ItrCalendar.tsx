'use client'
import React, {useRef, useState, useEffect, cache, SyntheticEvent, Ref, forwardRef} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar, ICellDictionary, ICellProperty } from "@/models/ICalendar";
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

const ItrCalendar = ({year, month, division_id, session, refresh, writeMode, dayType, dict}: 
   {year: number, month: number, division_id: number, session: Session, refresh: boolean, writeMode: boolean, dayType: number | undefined, dict: ICellDictionary}) => {
   const toast = useRef<Toast>(null);
   const [calendarData, setCalendarData] = useState<ICalendar>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [cardHeader, setCardHeader] = useState<string>('');
   const [cardVisible, setCardVisible] = useState<boolean>(false);
   const [selectedExclusion, setSelectedExclusion] = useState<Exclusion | null>(null);
   const [selectedId, setSelectedId] = useState<number | undefined>(undefined); 
   const [checker, setChecker] = useState<boolean>(false);

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
      const response = await res.json();
      setCalendarData(response.data);
      setIsLoaded(false);
   }

   const recalcFooter = (day: number, delta: number) => {
      let _data = calendarData;
      const item = _data?.footer?.hours?.find((i) => i.day === day);
      if (item)
         item.hours = item.hours - delta;
      if (_data?.footer?.sum)
         _data.footer.sum = _data.footer.sum - delta;
      if (_data?.footer?.total)
         _data.footer.total = _data.footer.total - delta;
      setChecker(!checker);
      setCalendarData(_data);

   }

   //@ts-ignore
   if (calendarData === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   return (
      <React.Fragment>         
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <ItrCalendarHeader header={calendarData?.header}/>               
               {
                  calendarData?.rows?.map((row, i) => { return <ItrCalendarRow key={`row`} row={row} index={i} writeMode={writeMode} dayType={dayType} recalcFooter={recalcFooter} dict={dict}/> })
               }
               <ItrCalendarFooter footerData={calendarData?.footer} checker={checker}/>
            </div>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
