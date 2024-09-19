'use client'
import ItrCalendar from "@/components/calendar/ItrCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import React, {useRef, useState, useEffect} from "react";

//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session} = useSession();

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   } 

   return (
      session ?
      <div className="grid">
         <div className="col-12">
            <div className="card pt-1">
               <h3>Рабочий календарь</h3> 
               <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
               <ItrCalendar year={date.getFullYear()} month={date.getMonth()+1} division_id={session?.user?.division_id} session={session} />
            </div>
         </div>
      </div> : <React.Fragment/>
   );
};

export default Calendar;
