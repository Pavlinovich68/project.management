'use client'
import ItrDivisionCalendar from "@/components/ItrDivisionCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { useSession } from "next-auth/react";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, {useEffect, useRef, useState} from "react";
import styles from "./styles.module.scss"
import DateHelper from "@/services/date.helpers";
import ItrProjectsInWork from "@/components/ItrProjectsInWork";

const ProjectCalendar = () => {
   const {data: session} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
   
   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
   }

   const checkRoles = (accessRoles: string[]) => {
      const userRoles = session?.user?.roles;
      if (!userRoles) {
         return false;
      }
      const roles = Object.keys(userRoles);
      const intersection = accessRoles.filter(x => roles.includes(x));
      return intersection.length > 0
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date??new Date()} onClick={monthSwitch}/>
   );

   if (!session) return;
   if (!date) return;

   const changeDate = (day: number) => {
      setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day));
   }

   return (
      <React.Fragment>
         <div className="grid">
            <div className="col-12">
               <div className="card">
                  <h3>{checkRoles(['master']) ? 'Контроль рабочего времени' : 'Распределение работ по проектам'}</h3>               
                  <Toolbar center={centerContent}/>
                  <div className={classNames("card mt-2", checkRoles(['developer']) ? styles.workerWorkPlace : styles.masterWorkPlace)}>
                     <div className={classNames(styles.projectsList)}>
                        <p>Выполненные работы на дату: <h6 style={{display: "contents"}}>{DateHelper.formatDate(selectedDate)}<sup> *</sup></h6></p>
                        <ItrProjectsInWork year={selectedDate.getFullYear()} month={selectedDate.getMonth()+1} day={selectedDate.getDate()} user_id={session.user.id}/>
                     </div>
                     <ItrDivisionCalendar year={date?.getFullYear()} month={date?.getMonth()+1} user_id={session.user.id} dayClick={changeDate}/>
                  </div>
                  <small style={checkRoles(['developer']) ? {display: "block"} : {display: "none"}}><sup>*</sup> Для выбора кликните с удерданием клавиши Ctrl в календаре по требуемой дате</small>
               </div>
            </div>
         </div>
      </React.Fragment>      
   );
};

export default ProjectCalendar;
