'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrCalendarRow from "./ItrCalendarRow";
import { useSession } from "next-auth/react";
import { classNames } from "primereact/utils";

const ItrCalendar = ({year, month}: {year: number, month: number}) => {
   const {data: session} = useSession();
   const [days, setDays] = useState<number>();
   const [profiles, setProfiles] = useState<any[]>([]);
   const [daysData, setDaysData] = useState<any[]>([]);

   useEffect(() => {
      setDays(new Date(year, month, 0).getDate());
      readProfiles();
      readDays();
   }, [year, month]);

   const readProfiles = async () => {
      const res = await fetch(`/api/calendar/division/profiles`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({division: session?.user?.division_id, year: year, month: month})
      });
      const data = await res.json();
      setProfiles(data.data);
   }

   

   const readDays = async () => {
      const res = await fetch(`/api/calendar/production/days`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({year: year, month: month-1})
      });
      const data = await res.json();
      setDaysData(data.data);
   }

   return (
      <div className="card calendar" style={{marginTop: "1em"}}>
         <div className="flex justify-content-center header">
            <div className="flex align-items-center justify-content-center w-12rem data-cell-h font-bold cell-gray">
               Фамилия
            </div>
            {daysData.map((day) => {
               return (
                  <div key="calendar-header" className={classNames("flex align-items-center justify-content-center data-cell font-bold", day.background_class)}>
                     {day.day}
                  </div>
               )
            })}
            <div className="flex align-items-center justify-content-center w-4rem data-cell-h font-bold cell-gray">
               Часов
            </div>         
         </div>
         {profiles.map((profile) => { return (
               <ItrCalendarRow key="calendar-profile" id={profile.id} name={profile.short_name} year={year} month={month} days={days} colors={daysData} />
            )
         })}
      </div>
   );
};

export default ItrCalendar;
