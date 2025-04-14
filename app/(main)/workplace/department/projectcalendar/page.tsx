'use client'
import ItrDivisionCalendar from "@/components/ItrDivisionCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { ICalendarCell } from "@/models/ICalendar";
import DateHelper from "@/services/date.helpers";
import RolesHelper from "@/services/roles.helper";
import { useSession } from "next-auth/react";
import { DataView } from "primereact/dataview";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { IBaseEntity } from "@/models/IBaseEntity";
import { Dropdown } from "primereact/dropdown";
import { IInProgressReport } from "@/models/IInProgressReport";
import ItrInProgressItem from "@/components/ItrInProgressItem";

const ProjectCalendar = () => {
   const {data: session, status} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const [selectedCell, setSelectedCell] = useState<ICalendarCell|undefined>()
   const [projects, setProjects] = useState<IBaseEntity[]>();
   
   const readProjects = async () => {
      const res = await fetch(`/api/project/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setProjects(data.data);
   }

   useEffect(() => {
      readProjects();
   }, [])

   const items: IInProgressReport[] = [
      {id: 1, month: 4, day: 12, hours: 2, work_type: 0, note: 'Работа "1', project: {id: 36, name: 'Модуль \"Порядок отнесения субъектов контроля к определённой категории риска\"'}},
      {id: 1, month: 4, day: 12, hours: 3, work_type: 0, note: 'Работа №2', project: {id: 37, name: 'Модуль \"Порядок отнесения субъектов контроля к определённой категории риска\"'}},
      {id: 1, month: 4, day: 12, hours: 3, work_type: 0, note: 'Работа №3', project: {id: 38, name: 'Модуль \"Порядок отнесения субъектов контроля к определённой категории риска\"'}}
   ]

   const spiner = (
      <i className="pi pi-spin pi-spinner flex align-items-center justify-content-center" style={{ fontSize: '10rem', color: '#326fd1'}}></i>
   )   
   if (status === 'loading') return spiner;
   if (!session) return <React.Fragment></React.Fragment>;
   
   const monthSwitch = (xdate: Date) => {
      setDate(xdate);
      setSelectedCell(undefined);
   }

   const centerContent = (
      <ItrCalendarSwitch xdate={date??new Date()} onClick={monthSwitch}/>
   );

   const changeDate = (cell: ICalendarCell) => {
      setSelectedCell(cell);
   }

   const itemTemplate = (item: IInProgressReport, index: number) => {
      return (<ItrInProgressItem elem={item} projects={projects}/>);
   };

   const listTemplate = (items: IInProgressReport[]) => {
      if (!items || items.length === 0) return null;

      let list = items.map((job, index) => {
         return itemTemplate(job, index);
      });
      return <div className="grid grid-nogutter">{list}</div>;
   };

   return (
      <React.Fragment>
         <div className="grid w-full">
            <div className="col-12">
               <div className="card">
                  <h3>{RolesHelper.checkRoles(session?.user.roles, ['master']) ? 'Контроль рабочего времени' : 'Распределение работ по проектам'}</h3>
                  <Toolbar center={centerContent}/>
                  <div className={classNames("card mt-2", RolesHelper.checkRoles(session?.user.roles, ['developer']) ? styles.workerWorkPlace : styles.masterWorkPlace)}>
                     <ItrDivisionCalendar year={date?.getFullYear()} month={date?.getMonth()+1} user_id={session.user.id} dayClick={changeDate} needReload={true}/>
                        <div className={classNames(styles.projectsList)}>                        
                        <p>Выполненные работы на дату: <h6 style={{display: "contents"}}>{DateHelper.formatDate(date)}<sup> *</sup></h6></p>                        
                        <DataView value={items} listTemplate={listTemplate} />
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
