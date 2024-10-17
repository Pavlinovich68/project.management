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

   if (!session) return;

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Проекты в работе</h3>               
               <Toolbar center={centerContent}/>
               <h5 className="flex justify-content-center flex-wrap">{session.user?.name}</h5>
            </div>
         </div>
      </div>
   );
};

export default ProjectCalendar;
