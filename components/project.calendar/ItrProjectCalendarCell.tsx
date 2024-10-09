'use client'
import { ICalendarCell, ICellDictionary } from "@/models/ICalendar";
import CellTypes from "@/services/cell.types";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";


const ItrProjectCalendarCell = ({row, cell, writeMode, dayType, recalc, dict, onEdit}:
   {row: number, cell: ICalendarCell, writeMode: boolean, dayType: number | undefined, recalc: any, dict: ICellDictionary, onEdit: any}) => {
   const [hours, setHours] = useState<number>(cell.hours)

   const getHours = (type: number): number => {
      if (type === 1) return 7;
      if ([3,4,10].includes(type)) return 8;
      return 0;
   }

   const onCellClick = (e:  React.MouseEvent<HTMLElement>) => {
      if (!writeMode || dayType === undefined) return;
      if (e.ctrlKey) {
         const el = document.getElementById(`calendar-cell-id-${cell.id}`);
         CellTypes.list.map((item) => {
            el?.classList.remove(`cell-bg-${item.id}`)
            el?.classList.remove(`cell-tc-${item.id}`)
         });
         el?.classList.add(`cell-bg-${dayType}`);
         el?.classList.add(`cell-tc-${dayType}`);
         const oldVal = Number(el?.getAttribute('data-hours'));
         const _hours = getHours(dayType??4);
         el?.setAttribute('data-hours', _hours.toString());
         setHours(_hours);
         recalc(cell.day, oldVal-_hours);
         dict[cell.id] = dayType;
         onEdit();
      }     
   }

   return (
      <div 
         id={`calendar-cell-id-${cell.id}`} 
         key={`calendar-cell-id-${cell.id}`}
         data-col-type={0}
         data-base-type={cell.type} 
         data-row={row}
         data-hours={hours}
         onClick={(e) => onCellClick(e)}
         className={classNames(`flex align-items-center justify-content-center w-4rem font-bold noselect day-cell cell-tc-${cell.type} cell-bg-${cell.type}`)}
      >{hours}</div>
   );
};

export default ItrProjectCalendarCell;
