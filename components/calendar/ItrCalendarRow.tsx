'use client'
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";
import { ICalendar, ICalendarRow } from "@/models/ICalendar";

const ItrCalendarRow = ({row}:{row:ICalendarRow}) => {
   const [start, setStart] = useState<number>(0);
   const [end, setEnd] = useState<number>(0);
   const [selecting, setSelecting] = useState<boolean>(false);

   const beginSelection = (i: number) => {
      setSelecting(true);
      setStart(i);
      updateSelection(i);
   };
   const endSelection = (i = end) => {
      setSelecting(false);
      updateSelection(i);
   };

   const updateSelection = (i: number) => {
      if (selecting) {
         setEnd(i);
      }
   };

   return (
      <React.Fragment>
         <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
            <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
            {
               row?.cells?.map((day) => {
                  let cellClass = styles.dataCell;
                  switch (day.type) {
                     case 0: cellClass = "cell-0"; break;
                     case 1: cellClass = "cell-1"; break;
                     case 2: cellClass = "cell-2"; break;
                     case 3: cellClass = "cell-3"; break;
                     case 4: cellClass = "cell-4"; break;
                     case 5: cellClass = "cell-5"; break;
                     case 6: cellClass = "cell-6"; break;
                     case 7: cellClass = "cell-7"; break;
                     case 8: cellClass = "cell-8"; break;
                     case 9: cellClass = "cell-9"; break;
                     case 10: cellClass = "cell-010"; break;
                  }
                  return (
                     <div 
                        id={`calendar-cell-id-${day.id}`} 
                        key={`calendar-cell-id-${day.id}`} 
                        //onClick={(e) => onCellClick(day.id, e)}
                        onMouseDown={() => beginSelection(day.id)}
                        onMouseUp={() => endSelection(day.id)} 
                        onMouseMove={() => updateSelection(day.id)}
                        className={classNames("flex align-items-center justify-content-center w-4rem font-bold noselect", styles.dataCell, cellClass,
                           (end <= day.id && day.id <= start) || (start <= day.id && day.id <= end) ? "bg-red-600" : ""
                        )}
                     >{day.hours}</div>
                  )
               })
            }
            <div className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.hours}</div>
            <div className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.total?.toLocaleString()}</div>
         </div>
      </React.Fragment>
   );
};

export default ItrCalendarRow;
