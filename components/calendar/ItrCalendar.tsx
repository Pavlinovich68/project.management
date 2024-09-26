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

   const exclusions: Exclusion[] = [
      {name: 'Выходной',               value: 0},
      {name: 'Сокращенный',            value: 1},
      {name: 'Перенесенный выходной',  value: 2},
      {name: 'Перенесенный рабочий',   value: 3},
      {name: 'Рабочий',                value: 4},
      {name: 'Отпуск',                 value: 5},
      {name: 'Больничный',             value: 6},
      {name: 'Без содержания',         value: 7},
      {name: 'Прогул',                 value: 8},
      {name: 'Вакансия',               value: 9},
      {name: 'Работа в выходной',      value: 10},
   ];

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

   const saveCellType = async () => {
      const el = document.getElementById(`calendar-cell-id-${selectedId}`);
      el?.classList.remove('cell-0');
      el?.classList.remove('cell-1');
      el?.classList.remove('cell-2');
      el?.classList.remove('cell-3');
      el?.classList.remove('cell-4');
      el?.classList.remove('cell-5');
      el?.classList.remove('cell-6');
      el?.classList.remove('cell-7');
      el?.classList.remove('cell-8');
      el?.classList.remove('cell-9');
      el?.classList.remove('cell-10');
      el?.classList.add(`cell-${selectedExclusion}`);
      setSelectedId(undefined);
      
      await fetch(`/api/calendar/department/update_cell`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            id: selectedId, 
            type: selectedExclusion}),
         cache: 'force-cache'
      });
      setCardVisible(false);
      getCalendarData();
   }

   //@ts-ignore
   if (data === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   return (
      <React.Fragment>         
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <ItrCalendarHeader header={data?.header}/>               
               {
                  data?.rows?.map((row) => { return <ItrCalendarRow key={`row`} row={row} writeMode={writeMode} dayType={dayType}/> })
               }
               <ItrCalendarFooter footer={data?.footer}/>
            </div>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
