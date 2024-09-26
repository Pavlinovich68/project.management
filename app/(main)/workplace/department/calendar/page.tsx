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


//TODO - Пример использования useSession
const Calendar = () => {
   const [date, setDate] = useState<Date>(new Date())
   const {data: session} = useSession();
   const [refresh, setRefresh] = useState<boolean>(false);
   const [editMode, setEditMode] = useState<boolean>(false);
   const [circleClass, setCircleClass] = useState<string | undefined>(undefined);

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
         <div className={classNames(styles.circleIndicator, circleClass)}></div>
      </React.Fragment>
   ) : (<React.Fragment/>);

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
                  cellClass={circleClass}
               />
               <Tag className="calendar-tag cell-bg-0" onClick={(e) => setCircleClass('cell-bg-0')} value="Выходной"></Tag>
               <Tag className="calendar-tag cell-bg-1" onClick={(e) => setCircleClass('cell-bg-1')} value="Сокращенный"></Tag>
               <Tag className="calendar-tag cell-bg-2" onClick={(e) => setCircleClass('cell-bg-2')} value="Перенесенный выходной"></Tag>
               <Tag className="calendar-tag cell-bg-3" onClick={(e) => setCircleClass('cell-bg-3')} value="Перенесенный рабочий"></Tag>
               <Tag className="calendar-tag cell-bg-4" onClick={(e) => setCircleClass('cell-bg-4')} value="Рабочий"></Tag>
               <Tag className="calendar-tag cell-bg-5" onClick={(e) => setCircleClass('cell-bg-5')} value="Отпуск"></Tag>
               <Tag className="calendar-tag cell-bg-6" onClick={(e) => setCircleClass('cell-bg-6')} value="Больничный"></Tag>
               <Tag className="calendar-tag cell-bg-7" onClick={(e) => setCircleClass('cell-bg-7')} value="Без содержания"></Tag>
               <Tag className="calendar-tag cell-bg-8" onClick={(e) => setCircleClass('cell-bg-8')} value="Прогул"></Tag>
               <Tag className="calendar-tag cell-bg-9" onClick={(e) => setCircleClass('cell-bg-9')} value="Вакансия"></Tag>
               <Tag className="calendar-tag cell-bg-10" onClick={(e) => setCircleClass('cell-bg-10')} value="Работа в выходной"></Tag>
            </div>
         </div>
      </div> : <React.Fragment/>
   );
};

export default Calendar;
