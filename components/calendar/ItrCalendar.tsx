'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrCalendarRow from "./ItrCalendarRow";
import { useSession } from "next-auth/react";

const ItrCalendar = ({year, month}: {year: number, month: number}) => {
   const {data: session} = useSession();
   const [days, setDays] = useState<number>();
   const [profiles, setProfiles] = useState<any[]>([]);

   useEffect(() => {
      setDays(new Date(year, month, 0).getDate());
      readProfiles();
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
   return (
      <div className="card calendar" style={{marginTop: "1em"}}>
         <div className="flex justify-content-center header">
            <div className="flex align-items-center justify-content-center w-12rem h-2rem font-bold cell">
               Фамилия
            </div>
            {Array.from(Array(days).keys()).map((day) => {
               return (
                  <div className="flex align-items-center justify-content-center w-2rem h-2rem font-bold cell">
                     {day+1}
                  </div>
               )
            })}
            <div className="flex align-items-center justify-content-center w-4rem h-2rem font-bold cell">
               Часов
            </div>         
         </div>
         {profiles.map((profile) => { return (
               <ItrCalendarRow id={profile.id} name={profile.short_name} year={year} month={month} days={days} />
            )
         })}
      </div>
   );
};

export default ItrCalendar;
