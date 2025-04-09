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
import RolesHelper from "@/services/roles.helper";

interface IRateCalendarCell {
   year: number,
   month: number,
   day: number,
   rate_id: number,
   type: number
}
//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session, status} = useSession();
   const [refresh, setRefresh] = useState<boolean>(false);
   const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
   const [cells, setCells] = useState<IRateCalendarCell[]>([]);

   const spiner = (
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1'}}></i>
   )

   if (status === 'loading') return spiner;
   if (!session) return <></>;

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const startContent = (
      <div>
         <Button icon="pi pi-refresh" type="button" severity="secondary" className="mr-2" onClick={() => { setCells([]); setRefresh(!refresh); }}/>
         {
            RolesHelper.checkRoles(session.user.roles, ['master']) ?
               <Button icon="pi pi-save" type="button" severity="secondary" className="mr-2" onClick={() => { saveCells(); }} disabled={!saveEnabled}/> :
               <></>
         }         
      </div>
   );
   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );

   const changeDayType = (e: ICalendarCell, rate_id: number, is_clear: boolean, val: number) => {      
      let _cells = cells.map(i => i);
      if (is_clear) {
         const exists = _cells.find((i) => i.day === e.day);
         if (exists) {
            const index = _cells.indexOf(exists, 0);
            if (index > -1)
               _cells.splice(index, 1);
         }
      } else {
         _cells.push({
            year: date.getFullYear(), 
            month: date.getMonth()+1, 
            day: e.day,
            rate_id: rate_id, 
            type: e.type})
      }      
      setCells(_cells);
      setSaveEnabled(_cells.length > 0);
   }

   const saveCells = async () => {
      await fetch('/api/calendar/department/personal_exclusion', {
         method: 'POST',
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            cells: cells
         })
      });
      setCells([]);
      setRefresh(!refresh);
      setSaveEnabled(false);
   }

   return (
      <div className="grid w-full">
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
      </div>
   );
};

export default Calendar;
