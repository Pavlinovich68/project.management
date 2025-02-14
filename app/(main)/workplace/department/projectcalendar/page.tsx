'use client'
import ItrMonthCalendar from "@/components/calendar/ItrMonthCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, {useEffect, useRef, useState} from "react";

const ProjectCalendar = () => {
   const {data: session} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const toast = useRef<Toast>(null)

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );

   if (!session) return;

   console.log(session.user);

   const getCalendarData = async () => {
      if (!session.user.division_id) {
         toast.current?.show({severity:'error', summary: 'Сессия приложения', detail: 'Идентификатор подразделения недоступен!', life: 3000});
         return;
      }
      setIsLoaded(true);
      const res = await fetch(`/api/calendar/department/month`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            //@ts-ignore
            employee_id: session.user.employee_id, 
            year: new Date(), 
            month: month}),
         cache: 'force-cache'
      });
      const response = await res.json();
      setCalendarData(response.data);
      setIsLoaded(false);
   }

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
