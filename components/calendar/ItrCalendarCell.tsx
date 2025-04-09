import { IBaseEntity } from "@/models/IBaseEntity";
import { ICalendarCell } from "@/models/ICalendar";
import CellTypes from "@/services/cell.types";
import RolesHelper from "@/services/roles.helper";
import { CalendarCellEventCallbackExt } from "@/types/CalendarCellEventCallbackExt";
import { ContextMenu } from "primereact/contextmenu";
import { classNames } from "primereact/utils";
import React, { SyntheticEvent, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import CalendarHelper from "@/services/calendar.helper";

const ItrCalendarCell = ({year, month, rateId, row, cell, callback}:{year: number, month: number, rateId: number | undefined | null, row: number, cell: ICalendarCell, callback: CalendarCellEventCallbackExt}) => {
   const cm = useRef<ContextMenu | null>(null);
   const [currentCell, setCurrentCell] = useState<ICalendarCell>(cell);
   const {data: session} = useSession();

   const getCell = async (year: number, month: number, day: number): Promise<ICalendarCell> => {
      const res = await fetch(`/api/calendar/department/cell`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: year, 
            month: month,
            day: day
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      return response.data;
   }

   const changeType = async (val: number) => {
      let _cell: ICalendarCell | undefined = undefined;
      let newHours = val === 10 ? 8 : 0;
      const oldHours = currentCell.hours;
      if (val === -1) {
         _cell = await getCell(year, month, cell.day);         
         newHours = _cell.hours;
      } else {         
         _cell = {...currentCell, type: val, hours: newHours};
      }
      if (_cell) {      
         setCurrentCell(_cell);
         callback(_cell, rateId??-1, val===-1, newHours - oldHours);
      }
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
         label: 'Сбросить исключение',
         command: () => changeType(-1)
      }
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
         {
            RolesHelper.checkRoles(session?.user.roles, ['master']) ?
               <ContextMenu 
                  ref={cm} 
                  model={items}            
               /> : <></>
         }         
      </>
   );
};

export default ItrCalendarCell;
