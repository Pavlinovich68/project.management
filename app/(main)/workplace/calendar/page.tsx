'use client'
import ItrCalendar from "@/components/calendar/ItrCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import React, {useRef, useState, useEffect} from "react";

//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session} = useSession();

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   } 

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card pt-1">
               <h3>Рабочий календарь</h3>
               <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
               {  
                  session ? 
                  <ItrCalendar year={date.getFullYear()} month={date.getMonth()+1} division_id={session?.user?.division_id} /> : 
                  <div></div>
               }               
            </div>
         </div>
      </div>
   );
};

export default Calendar;
