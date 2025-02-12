import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React from "react";
import { ICalendarRow } from "@/models/ICalendar";
import ItrCalendarCell from "./ItrCalendarCell";

const ItrCalendarRow = ({row, index}:{row:ICalendarRow, index: number}) => {
   return (
      <React.Fragment>
         <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
            <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
            {               
               row?.cells?.map((day) => <ItrCalendarCell key={`calendar-cell-id-${day.day}`} row={index} cell={day}/>)
            }
            <div data-row={index} data-col-type={1} className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.hours}</div>
            <div data-row={index} data-col-type={2} className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.total?.toLocaleString()}</div>
         </div>
      </React.Fragment>
   ); 
};

export default ItrCalendarRow;
