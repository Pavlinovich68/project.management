import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, { useState } from "react";
import { ICalendarCell, ICalendarRow } from "@/models/ICalendar";
import ItrCalendarCell from "./ItrCalendarCell";
import { CalendarCellEventCallbackExt } from "@/types/CalendarCellEventCallbackExt";

const ItrCalendarRow = ({row, index, month, callback}:{row:ICalendarRow, index: number, month: number, callback: CalendarCellEventCallbackExt}) => {
   const [monthHours, setMonthHours] = useState<number>(row.hours);
   const [totalHours, setTotalHours] = useState<number>(row.total??0);

   const event = (e: ICalendarCell, rate_id: number, val: number) => {
      setMonthHours(monthHours + val);
      setTotalHours(totalHours + val);
      callback(e, rate_id, val);
   }

   return (
      <React.Fragment>
         <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
            <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
            {               
               row?.cells?.map((day) => <ItrCalendarCell key={`calendar-cell-id-${day.day}`} row={index} cell={day} rateId={row.rate_id} callback={event}/>)
            }
            <div data-row={index} data-col-type={1} className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{monthHours}</div>
            <div data-row={index} data-col-type={2} className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{totalHours?.toLocaleString()}</div>
         </div>
      </React.Fragment>
   ); 
};

export default ItrCalendarRow;
