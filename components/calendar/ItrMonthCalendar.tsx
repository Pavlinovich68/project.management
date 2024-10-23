'use client'
import { Toast } from "primereact/toast";
import React, {useRef, useState, useEffect} from "react";

const ItrMonthCalendar = ({employee_id, year, month}:{employee_id: number, year: number, month: number}) => {
   const toast = useRef<Toast>(null)
   const [isLoaded, setIsLoaded] = useState<boolean>(false)
   const [calendarData, setCalendarData] = useState()

   useEffect(()=>{

   }, [employee_id, year, month])

   const getCalendarData = async () => {
      //@ts-ignore
      if (!session?.user?.employee_id) {
         toast.current?.show({severity:'error', summary: 'Сессия приложения', detail: 'Идентификатор сотрудника недоступен!', life: 3000});
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
            employee_id: employee_id, 
            year: year, 
            month: month
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setCalendarData(response.data);
      setIsLoaded(false);
   }

   return (
      <React.Fragment>
         <div className="grid">
            <div className="col-12">
               <div className="card">
                  <h3>{employee_id}</h3>
                  <h3>{year}</h3>
                  <h3>{month}</h3>
               </div>
            </div>
         </div>
         <Toast ref={toast} />
      </React.Fragment>
      
   );
};

export default ItrMonthCalendar;
