'use client'
import ItrMonthCalendar from "@/components/calendar/ItrMonthCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, {useRef, useState} from "react";

const ProjectCalendar = () => {
   const {data: session} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const toast = useRef<Toast>(null)

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );

   if (!session) return;

   console.log(session.user.roles)

   return (
      <React.Fragment>
         {/* <div className="grid">
            <div className="col-12">
               <div className="card">
                  <h3>Проекты в работе</h3>               
                  <Toolbar center={centerContent}/>
                  <h5 className="flex justify-content-center flex-wrap">{session.user?.name}</h5>
                  <ItrMonthCalendar 
                     //@ts-ignore
                     employee_id={session.user.employee_id}
                     year={date.getFullYear()}
                     month={date.getMonth()+1}
                  />
               </div>
            </div>
         </div> */}
         <Toast ref={toast} />
      </React.Fragment>      
   );
};

export default ProjectCalendar;
