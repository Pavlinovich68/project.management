'use client'
import ItrCalendar from "@/components/calendar/ItrCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import React, {useRef, useState, useEffect} from "react";

const Calendar = () => {
   const {data: session, status} = useSession();
   const [date, setDate] = useState<Date>(new Date())

   console.log(session?.user);

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   } 

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card pt-1">
               <h3>Рабочий календарь</h3>
               <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
               <ItrCalendar year={date.getFullYear()} month={date.getMonth()+1}/>
            </div>
         </div>
      </div>
   );
};

export default Calendar;
