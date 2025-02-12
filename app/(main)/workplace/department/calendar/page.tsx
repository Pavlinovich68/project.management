'use client'
import ItrCalendar from "@/components/calendar/ItrCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import React, {useState} from "react";
import CellTypes from "@/services/cell.types";


//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session} = useSession();
   const [refresh, setRefresh] = useState<boolean>(false);

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const startContent = (
      <div>
         <Button icon="pi pi-refresh" severity="secondary" className="mr-2" onClick={() => { 
               setRefresh(!refresh);
         }}/>
      </div>
   );
   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );

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
                  refresh={refresh}
               />               
            </div>
         </div>
      </div> : <React.Fragment/>
   );
};

export default Calendar;
