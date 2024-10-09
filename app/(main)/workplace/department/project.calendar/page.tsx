'use client'
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import ItrProjectCalendar from "@/components/project.calendar/ItrProjectCalendar";
import { ICellDictionary } from "@/models/ICalendar";
import { useSession } from "next-auth/react";
import { Toolbar } from "primereact/toolbar";
import React, {useRef, useState, useEffect} from "react";

const ProjectCalendar = () => {
   const {data: session} = useSession();
   const [date, setDate] = useState<Date>(new Date())
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

   return (
      session ?
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Проекты в работе</h3>
               <Toolbar center={centerContent}/>
               <ItrProjectCalendar 
                  year={date.getFullYear()} 
                  month={date.getMonth()+1} 
                  division_id={session?.user?.division_id}
                  refresh={refresh}
                  writeMode={editMode}
                  dayType={editDayType}
                  dict={values}
                  onEdit={onEdit}
               />
            </div>
         </div>
      </div> : <React.Fragment/>
   );
};

export default ProjectCalendar;
