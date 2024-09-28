'use client'
import { ICalendarCell } from "@/models/ICalendar";
import CellTypes from "@/services/cell.types";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";


const ItrCalendarCell = ({cell, writeMode, dayType}:{cell: ICalendarCell, writeMode: boolean, dayType: number | undefined}) => {
   
   const onCellClick = (cell: ICalendarCell, e: any) => {
      if (!writeMode) return;
      const el = document.getElementById(`calendar-cell-id-${cell.id}`);
      CellTypes.list.map((iten) => {
         el?.classList.remove(`cell-bg-${iten.id}`)
         el?.classList.remove(`cell-tc-${iten.id}`)
      });
      el?.classList.add(`cell-bg-${dayType}`);
      el?.classList.add(`cell-ts-${dayType}`);
   }

   return (
      <div 
         id={`calendar-cell-id-${cell.id}`} 
         key={`calendar-cell-id-${cell.id}`}
         data-base-type={cell.type} 
         onDoubleClick={(e) => onCellClick(cell, e)}
         className={classNames(`flex align-items-center justify-content-center w-4rem font-bold noselect day-cell cell-tc-${cell.type} cell-bg-${cell.type}`)}
      >{cell.hours}</div>
   );
};

export default ItrCalendarCell;
