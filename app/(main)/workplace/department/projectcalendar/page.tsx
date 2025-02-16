'use client'
import ItrDivisionCalendar from "@/components/ItrDivisionCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, {useEffect, useRef, useState} from "react";

const ProjectCalendar = () => {
   const {data: session} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   
   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date??new Date()} onClick={monthSwitch}/>
   );

   if (!session) return;
   if (!date) return;

   return (
      <React.Fragment>
         <div className="grid">
            <div className="col-12">
               <div className="card">
                  <h3>Проекты в работе</h3>               
                  <Toolbar center={centerContent}/>
                  <ItrDivisionCalendar year={date?.getFullYear()} month={date?.getMonth()+1} user_id={session.user.id}/>
                  {/* <ItrMonthCalendar 
                     //@ts-ignore
                     employee_id={session.user.employee_id}
                     year={date.getFullYear()}
                     month={date.getMonth()+1}
                  /> */}
               </div>
            </div>
         </div>
      </React.Fragment>      
   );
};

export default ProjectCalendar;
