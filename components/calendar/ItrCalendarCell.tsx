import { ICalendarCell } from "@/models/ICalendar";
import { classNames } from "primereact/utils";
import React from "react";


const ItrCalendarCell = ({row, cell}:{row: number, cell: ICalendarCell}) => {
   return (
      <div 
         id={`calendar-cell-id-${cell.day}`} 
         key={`calendar-cell-id-${cell.day}`}
         data-col-type={0}
         data-base-type={cell.type} 
         data-row={row}
         data-hours={cell.hours}
         className={classNames(`flex align-items-center justify-content-center w-4rem font-bold noselect day-cell cell-tc-${cell.type} cell-bg-${cell.type}`)}
      >{cell.hours}</div>
   );
};

export default ItrCalendarCell;
