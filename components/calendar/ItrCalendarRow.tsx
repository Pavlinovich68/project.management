'use client'
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";
import { ICalendar, ICalendarRow } from "@/models/ICalendar";
import ItrCalendarCell from "./ItrCalendarCell";

const ItrCalendarRow = ({row, writeMode, dayType}:{row:ICalendarRow, writeMode: boolean, dayType: number | undefined}) => {
   const [start, setStart] = useState<number>(0);
   const [end, setEnd] = useState<number>(0);
   const [selecting, setSelecting] = useState<boolean>(false);
   const [startUpdate, setStartUpdate] = useState<boolean>(false)

   const beginSelection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {
      if (!writeMode) return;
      setStartUpdate(true);
      setSelecting(true);
      setStart(i);
      updateSelection(e, i);
   };
   const endSelection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i = end) => {      
      if (!writeMode || !startUpdate) return;
      const el = e.target as HTMLDivElement;
      console.log(`end ${el.getAttribute('data-base-type')}`);
      setStartUpdate(false)
      setSelecting(false);
      updateSelection(e, i);
   };

   const updateSelection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {      
      if (!writeMode || !startUpdate) return;
      if (selecting) {
         setEnd(i);
      }
   };

   return (
      <React.Fragment>
         <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
            <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
            {
               row?.cells?.map((day) => <ItrCalendarCell key={`calendar-cell-id-${day.id}`} id={day.id} day={day.day} hours={day.hours} type={day.type} writeMode={writeMode}/>)
            }
            <div className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.hours}</div>
            <div className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.total?.toLocaleString()}</div>
         </div>
      </React.Fragment>
   );
};

export default ItrCalendarRow;
