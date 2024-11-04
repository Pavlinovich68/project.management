'use client'
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";
import { ICalendar, ICalendarRow, ICellDictionary } from "@/models/ICalendar";
import ItrCalendarCell from "./ItrCalendarCell";

const ItrCalendarRow = ({row, index, writeMode, dayType, recalcFooter, onEdit}:
   {row:ICalendarRow, index: number, writeMode: boolean, dayType: number | undefined, recalcFooter: any, onEdit: void}) => {
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
               row?.cells?.map((day) => <ItrCalendarCell key={`calendar-cell-id-${day.id}`} row={index} cell={day} writeMode={writeMode} dayType={dayType} recalc={recalcRow} onEdit={onEdit}/>)
            }
            <div data-row={index} data-col-type={1} className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{hours}</div>
            <div data-row={index} data-col-type={2} className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{total?.toLocaleString()}</div>
         </div>
      </React.Fragment>
   ); 
};

export default ItrCalendarRow;
