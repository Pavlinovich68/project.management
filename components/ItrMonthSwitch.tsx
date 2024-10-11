import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, {useState} from "react";

const ItrCalendarSwitch = ({xdate, onClick}: {xdate: Date, onClick: any}) => {
   const [date, setDate] = useState<Date>(xdate)

   return (
      <div className="p-inputgroup calendar-switch flex justify-content-center flex-wrap">
         <div className="flex align-items-center justify-content-center">
         <Calendar className="prod-calendar-switch" value={date} onChange={(e) => {
               setDate(e.value as Date)
               onClick(e.value)
            }} view="month" dateFormat="MM yy" locale="ru" required/>
         </div>
         
      </div>
   );
};

export default ItrCalendarSwitch;
