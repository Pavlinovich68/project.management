'use client'
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";
import { ICalendar, ICalendarRow } from "@/models/ICalendar";

const ItrCalendarRow = ({row, writeMode, dayType}:{row:ICalendarRow, writeMode: boolean, dayType: number}) => {
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
               row?.cells?.map((day) => {
                  let cellClass = styles.dataCell;
                  switch (day.type) {
                     case 0: cellClass = "day-cell cell-0 cell-bg-0"; break;
                     case 1: cellClass = "day-cell cell-1 cell-bg-1"; break;
                     case 2: cellClass = "day-cell cell-2 cell-bg-2"; break;
                     case 3: cellClass = "day-cell cell-3 cell-bg-3"; break;
                     case 4: cellClass = "day-cell cell-4 cell-bg-4"; break;
                     case 5: cellClass = "day-cell cell-5 cell-bg-5"; break;
                     case 6: cellClass = "day-cell cell-6 cell-bg-6"; break;
                     case 7: cellClass = "day-cell cell-7 cell-bg-7"; break;
                     case 8: cellClass = "day-cell cell-8 cell-bg-8"; break;
                     case 9: cellClass = "day-cell cell-9 cell-bg-9"; break;
                     case 10: cellClass = "day-cell cell-010 cell-bg-10"; break;
                  }
                  return (
                     <div 
                        id={`calendar-cell-id-${day.id}`} 
                        key={`calendar-cell-id-${day.id}`}
                        data-base-type={day.type} 
                        //onClick={(e) => onCellClick(day.id, e)}                        
                        onMouseDown={(e) => beginSelection(e, day.id)}
                        onMouseUp={(e) => endSelection(e, day.id)} 
                        onMouseMove={(e) => updateSelection(e, day.id)}
                        className={classNames("flex align-items-center justify-content-center w-4rem font-bold noselect", styles.dataCell, cellClass)}
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
