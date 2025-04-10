'use client'
import ItrDivisionCalendar from "@/components/ItrDivisionCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { ICalendarCell } from "@/models/ICalendar";
import DateHelper from "@/services/date.helpers";
import RolesHelper from "@/services/roles.helper";
import { useSession } from "next-auth/react";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { DataTable } from "primereact/datatable";
import { IBaseEntity } from "@/models/IBaseEntity";

interface IFactWorkReport {
   month             :number,
   day               :number,
   hours             :number,
   work_type         :number,
   note              :string,
   employee          :IBaseEntity,
   roadmap_item      :IBaseEntity
}

const ProjectCalendar = () => {
   const {data: session, status} = useSession()
   const [date, setDate] = useState<Date>(new Date())
   const [selectedCell, setSelectedCell] = useState<ICalendarCell|undefined>()

/*
id                Int         @id @default(autoincrement())
   month             Int
   day               Int
   hours             Int
   work_type         Int
   note              String
   employee_id       Int
   employee          employee    @relation(fields: [employee_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
   roadmap_item_id   Int
   roadmap_item      roadmap_item @relation(fields: [roadmap_item_id], references: [id])
   parent_id         Int?  // Идентификатор строки из которой 
*/   

   const data =

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
                        {/* </div><div className={classNames(styles.projectsList)} hidden={!selectedCell}> */}
                        <p>Выполненные работы на дату: <h6 style={{display: "contents"}}>{DateHelper.formatDate(new Date(date.getFullYear(), date.getMonth(), selectedCell?.day))}<sup> *</sup></h6></p>                        
                        <DataTable>

                        </DataTable>
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
