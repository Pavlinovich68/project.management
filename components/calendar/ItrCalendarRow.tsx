'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const ItrCalendarRow = ({id, name, year, month, days, colors}: {id: number, name: string, year: number, month: number, days?: number, colors: any[]}) => {
   const [daysData, setDaysData] = useState<any[]>([]);
   
   useEffect(() => {
      readDays();
   }, [id, year, month]);

   const readDays = async () => {
      const res = await fetch(`/api/calendar/production/days`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({profile_id: id, year: year, month: month-1})
      });
      const data = await res.json();
      setDaysData(data.data);
   }   
   let totalHours = 0;
   return (
      <div className="flex justify-content-center calendar-row">
            <div className="flex align-items-center justify-content-start w-12rem data-cell-h font-bold name-cell pl-2">{name}</div>
            {daysData.map((day) => {
               let hours = undefined;
               switch (day.exclusion_type) {
                  case 1: {
                     hours = 7;
                     break;
                  }
                  case -1: {
                     hours = 8;
                     break;
                  }
                  case 4: {
                     hours = 0;
                     break;
                  }
                  default: {
                     hours = 0;
                     break;
                  }
               }
               totalHours += hours;
               return (
                  <div key="calendar-profile-cell" className={classNames("flex align-items-center justify-content-center data-cell font-bold", day.background_class)}>
                     {hours}
                  </div>
               )
            })}
            <div className="flex align-items-center justify-content-end w-4rem data-cell-h font-bold name-cell pr-2">
               {totalHours}
            </div>
      </div>
   );
};

export default ItrCalendarRow;
