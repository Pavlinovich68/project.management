import { IBaseEntity } from "@/models/IBaseEntity";
import { ICalendarCell } from "@/models/ICalendar";
import CellTypes from "@/services/cell.types";
import { CalendarCellEventCallbackExt } from "@/types/CalendarCellEventCallbackExt";
import { ContextMenu } from "primereact/contextmenu";
import { classNames } from "primereact/utils";
import React, { SyntheticEvent, useRef, useState } from "react";

const ItrCalendarCell = ({rateId, row, cell, callback}:{rateId: number | undefined | null, row: number, cell: ICalendarCell, callback: CalendarCellEventCallbackExt}) => {
   const cm = useRef<ContextMenu | null>(null);
   const [currentCell, setCurrentCell] = useState<ICalendarCell>(cell);
   const [isChanged, setIsChanged] = useState<boolean>(false);

   const changeType = (val: number) => {
      let newHours = val === 10 ? 8 : 0;
      const oldHours = currentCell.hours;
      const _cell: ICalendarCell = {...currentCell, type: val, hours: newHours};
      setCurrentCell(_cell);
      callback(_cell, rateId??-1, newHours - oldHours);
   }
   const items = [
      {
         label: 'Больничный',
         command: () => changeType(6)
      },
      {
         label: 'Без содержания',
         command: () => changeType(7)
      },
      {
         label: 'Прогул',
         command: () => changeType(8)
      },
      {
         label: 'Работа в выходной',
         command: () => changeType(10)
      },
      {
         separator: true
      },
      {
         label: 'Сбросить состояние',
         command: () => changeType(10),
         disabled: !isChanged
      },
   ];

   const onRightClick = (event: SyntheticEvent, c: ICalendarCell) => {
      if (cm.current) {
            setCurrentCell(c);
            cm.current.show(event);
      }
   };
   return ( 
      <>
         <div 
            id={`calendar-cell-id-${currentCell.day}`} 
            key={`calendar-cell-id-${currentCell.day}`}
            data-col-type={0}
            data-base-type={currentCell.type} 
            data-row={row}
            data-hours={currentCell.hours}
            className={classNames(`flex align-items-center justify-content-center w-4rem font-bold noselect day-cell cell-tc-${currentCell.type} cell-bg-${currentCell.type}`)}
            onContextMenu={(event) => onRightClick(event, currentCell)}
         >{currentCell.hours}</div>
         <ContextMenu 
            ref={cm} 
            model={items}            
         />
      </>
   );
};

export default ItrCalendarCell;
