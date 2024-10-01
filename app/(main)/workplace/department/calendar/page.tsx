'use client'
import ItrCalendar from "@/components/calendar/ItrCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import CellTypes from "@/services/cell.types";
import { ICellDictionary } from "@/models/ICalendar";


//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session} = useSession();
   const [refresh, setRefresh] = useState<boolean>(false);
   const [editMode, setEditMode] = useState<boolean>(false);
   const [editDayType, setEditDayType] = useState<number | undefined>(undefined);   
   const [dict, setDict] = useState<ICellDictionary>({});

   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   } 

   const checkRoles = (arr: string[]):boolean => {
      const userRoles = session?.user?.roles;
      if (!userRoles) {
         return false;
      }
      const roles = Object.keys(userRoles);
      const intersection = arr.filter(x => roles.includes(x));
      return intersection.length > 0
   }

   const startContent = (
      <div>
         <Button icon="pi pi-refresh" severity="secondary" className="mr-2" onClick={() => setRefresh(!refresh)}/>
      </div>
   );
   const centerContent = (
      <ItrCalendarSwitch xdate={date} onClick={monthSwitch}/>
   );   

   const endContent = checkRoles(['master']) ? (
      <React.Fragment>         
         <InputSwitch checked={editMode} onChange={(e) => setEditMode(e.value)} />
         <div className={classNames(styles.circleIndicator, `cell-bg-${editDayType}`)}></div>
         <Button icon="pi pi-save" className="ml-3" rounded outlined severity="danger" aria-label="User" onClick={() => save()} />
      </React.Fragment>
   ) : (<React.Fragment/>);

   const save = async () => {
      console.log(dict);
   }


   return (
      session ?
      <div className="grid">
         <div className="col-12">
            <div className="card pt-1">
               <h3>Рабочий календарь</h3>
               <Toolbar start={startContent} center={centerContent} end={endContent} />                
               <ItrCalendar 
                  year={date.getFullYear()} 
                  month={date.getMonth()+1} 
                  division_id={session?.user?.division_id} 
                  session={session} 
                  refresh={refresh}
                  writeMode={editMode}
                  dayType={editDayType}
                  dict={dict}
               />
               {CellTypes.list.map((item) => <Tag key={`tag-${item.id}`} className={`calendar-tag cell-bg-${item.id}`} onClick={(e) => setEditDayType(item.id??undefined)} value={item.name}></Tag>)}
            </div>
         </div>
      </div> : <React.Fragment/>
   );
};

export default Calendar;
