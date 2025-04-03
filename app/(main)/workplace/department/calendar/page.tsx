'use client'
import ItrCalendar from "@/components/calendar/ItrCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import React, {useState} from "react";
import CellTypes from "@/services/cell.types";
import { ICalendarCell } from "@/models/ICalendar";

interface IRateCalendarCell {
   division_id: number,
   year: number,
   month: number,
   rate_id: number,
   cell: ICalendarCell
}
//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session} = useSession();
   const [refresh, setRefresh] = useState<boolean>(false);
   const [saveEnabled, setSaveEnabled] = useState<boolean>(false);

   const changedCells: IRateCalendarCell[] = [];

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const startContent = (
      <div>
         <Button icon="pi pi-refresh" type="button" severity="secondary" className="mr-2" onClick={() => { setRefresh(!refresh); }}/>
         <Button icon="pi pi-save" type="button" severity="secondary" className="mr-2" onClick={() => { setRefresh(!refresh); }} disabled={!saveEnabled}/>
      </div>
   );
   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );

   const changeDayType = (e: ICalendarCell, rate_id: number, val: number) => {
      setSaveEnabled(true);
      changedCells.push({division_id: session?.user?.division_id??-1, year: date.getFullYear(), month: date.getMonth()+1, rate_id: rate_id, cell: e});
      console.log(changedCells);
   }

   return (
      session ?
      <div className="grid">
         <div className="col-12">
            <div className="card pt-1">
               <h3>Рабочий календарь</h3>
               <Toolbar start={startContent} center={centerContent} />
               {CellTypes.list.map((item) => <Tag key={`tag-${item.id}`} className={`calendar-tag cell-bg-${item.id}`} value={item.name}></Tag>)}
               <ItrCalendar 
                  year={date.getFullYear()} 
                  month={date.getMonth()+1} 
                  division_id={session?.user?.division_id}
                  callback={changeDayType}
                  refresh={refresh}
               />               
            </div>
         </div>
      </div> : <React.Fragment/>
   );
};

export default Calendar;
