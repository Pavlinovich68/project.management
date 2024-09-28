'use client'
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";
import { ICalendar, ICalendarRow } from "@/models/ICalendar";
import ItrCalendarCell from "./ItrCalendarCell";

const ItrCalendarRow = ({row, writeMode, dayType}:{row:ICalendarRow, writeMode: boolean, dayType: number | undefined}) => {
   return (
      <React.Fragment>
         <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
            <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
            {
               row?.cells?.map((day) => <ItrCalendarCell key={`calendar-cell-id-${day.id}`} cell={day} writeMode={writeMode} dayType={dayType}/>)
            }
            <div className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.hours}</div>
            <div className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.total?.toLocaleString()}</div>
         </div>
      </React.Fragment>
   );
};

export default ItrCalendarRow;
