'use client'
import ItrMonthCalendar from "@/components/calendar/ItrMonthCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { ICellDictionary } from "@/models/ICalendar";
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, {useRef, useState, useEffect} from "react";

const ProjectCalendar = () => {
   const {data: session} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const toast = useRef<Toast>(null)
   const [isLoaded, setIsLoaded] = useState<boolean>(false)
   const [calendarData, setCalendarData] = useState();
   const [refresh, setRefresh] = useState<boolean>(false)
   const [editMode, setEditMode] = useState<boolean>(false);
   const [editDayType, setEditDayType] = useState<number | undefined>(undefined);
   const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
   let values: ICellDictionary = {};

   const onEdit = () => {
      setSaveEnabled(Object.keys(values).length > 0)
   }

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );

   if (!session) return;

   return (
      <React.Fragment>
         <div className="grid">
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
         </div>
         <Toast ref={toast} />
      </React.Fragment>      
   );
};

export default ProjectCalendar;
