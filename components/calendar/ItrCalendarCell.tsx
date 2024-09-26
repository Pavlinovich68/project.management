'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const ItrCalendarCell = ({id, day, hours, type, writeMode}:{id: number | undefined, day: number | undefined, hours: number | undefined, type: number | undefined, writeMode: boolean}) => {
   return (
      <div 
         id={`calendar-cell-id-${id}`} 
         key={`calendar-cell-id-${id}`}
         data-base-type={type} 
         //onClick={(e) => onCellClick(day.id, e)}
         className={classNames(`flex align-items-center justify-content-center w-4rem font-bold noselect day-cell cell-tc-${type} cell-bg-${type}`)}
      >{hours}</div>
   );
};

export default ItrCalendarCell;
