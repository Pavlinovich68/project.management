'use client'
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";
import { ICalendar, ICalendarRow, ICellDictionary } from "@/models/ICalendar";
import ItrProjectCalendarCell from "./ItrProjectCalendarCell";

const ItrProjectCalendarRow = ({row, index, writeMode, dayType, recalcFooter, dict, onEdit}:
   {row:ICalendarRow, index: number, writeMode: boolean, dayType: number | undefined, recalcFooter: any, dict: ICellDictionary, onEdit: void}) => {
   const [hours, setHours] = useState<number>(row.hours)
   const [total, setTotal] = useState<number | undefined>(row.total)
   const recalcRow = (day: number, delta: number) => {
      setHours(hours - delta);
      setTotal((total??0) - delta);
      recalcFooter(day, delta);
   }
   
   return (
      <React.Fragment>
         <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
            <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
            {
               row?.cells?.map((day) => <ItrProjectCalendarCell key={`calendar-cell-id-${day.id}`} row={index} cell={day} writeMode={writeMode} dayType={dayType} recalc={recalcRow} dict={dict} onEdit={onEdit}/>)
            }
         </div>
      </React.Fragment>
   ); 
};

export default ItrProjectCalendarRow;
