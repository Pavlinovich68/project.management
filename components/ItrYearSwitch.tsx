'use client'
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, {useRef, useState, useEffect} from "react";

const ItrYearSwitsh = ({year, onChange}: {year: number, onChange: any}) => {
   const [date, setDate] = useState<Date>(new Date(year, 0, 1))

   return (
      <div className="p-inputgroup calendar-switch flex justify-content-center flex-wrap">
         <div className="flex align-items-center justify-content-center w-2">
         <Calendar className="prod-calendar-switch" value={date} onChange={(e) => {
               setDate(e.value as Date);
               onChange(e.value?.getFullYear());
            }} view="year" dateFormat="yy 'год'" />
         </div>
      </div>   
   );
};

export default ItrYearSwitsh;
