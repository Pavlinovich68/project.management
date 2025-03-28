'use client'
import ItrDivisionCalendar from "@/components/ItrDivisionCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import ItrProjectsInWork from "@/components/projects-in-work/ItrProjectsInWork";
import { ICalendarCell } from "@/models/ICalendar";
import DateHelper from "@/services/date.helpers";
import RolesHelper from "@/services/roles.helper";
import { useSession } from "next-auth/react";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";

const ProjectCalendar = () => {
   const {data: session} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const [selectedCell, setSelectedCell] = useState<ICalendarCell|undefined>()
   const [saveWork, setSaveWork] = useState<boolean>(false);
   
   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
      setSelectedCell(undefined);
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date??new Date()} onClick={monthSwitch}/>
   );

   if (!session) return;
   if (!date) return;

   const changeDate = (cell: ICalendarCell) => {
      setSelectedCell(cell);
   }

   const saveWorks = (val: boolean) => {
      setSaveWork(!saveWork);
   }

   return (
      <React.Fragment>
         <div className="grid">
            <div className="col-12">
               <div className="card">
                  <h3>{RolesHelper.checkRoles(session.user.roles, ['master']) ? 'Контроль рабочего времени' : 'Распределение работ по проектам'}</h3>
                  <Toolbar center={centerContent}/>
                  <div className={classNames("card mt-2", RolesHelper.checkRoles(session.user.roles, ['developer']) ? styles.workerWorkPlace : styles.masterWorkPlace)}>
                     <ItrDivisionCalendar year={date?.getFullYear()} month={date?.getMonth()+1} user_id={session.user.id} dayClick={changeDate} needReload={saveWork}/>
                     <div className={classNames(styles.projectsList)} hidden={!selectedCell}>                        
                        <p>Выполненные работы на дату: <h6 style={{display: "contents"}}>{DateHelper.formatDate(new Date(date.getFullYear(), date.getMonth(), selectedCell?.day))}<sup> *</sup></h6></p>
                        <ItrProjectsInWork 
                           year={date.getFullYear()} 
                           month={date.getMonth()+1} 
                           cell={selectedCell} 
                           user_id={session.user.id} 
                           readOnly={!RolesHelper.checkRoles(session.user.roles, ['master', 'developer'])}
                           saveEvent={saveWorks}
                        />
                     </div>                     
                  </div>
                  <small style={RolesHelper.checkRoles(session.user.roles, ['developer']) ? {display: "block"} : {display: "none"}}><sup>*</sup> Для выбора кликните с удерданием клавиши Ctrl в календаре по требуемой дате</small>
               </div>
            </div>
         </div>
      </React.Fragment>
   );
};

export default ProjectCalendar;
