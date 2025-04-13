'use client'
import ItrDivisionCalendar from "@/components/ItrDivisionCalendar";
import ItrCalendarSwitch from "@/components/ItrMonthSwitch";
import { IBaseEntity } from "@/models/IBaseEntity";
import { ICalendarCell } from "@/models/ICalendar";
import DateHelper from "@/services/date.helpers";
import RolesHelper from "@/services/roles.helper";
import { useSession } from "next-auth/react";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import { DataView } from "primereact/dataview";

interface IFactJobReport {
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

   const items: IFactJobReport[] = [
      {month: 4, day: 12, hours: 2, work_type: 0, note: '', employee: {id: 1, name: 'Aкопян Левон Дмитриевич'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 3, work_type: 0, note: '', employee: {id: 1, name: 'Aкопян Левон Дмитриевич'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 3, work_type: 0, note: '', employee: {id: 1, name: 'Aкопян Левон Дмитриевич'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 2, work_type: 0, note: '', employee: {id: 2, name: 'Гажа Константин Владимирович'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 3, work_type: 0, note: '', employee: {id: 2, name: 'Гажа Константин Владимирович'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 3, work_type: 0, note: '', employee: {id: 2, name: 'Гажа Константин Владимирович'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 2, work_type: 0, note: '', employee: {id: 3, name: 'Гореньков Аркадий Юрьевич'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 3, work_type: 0, note: '', employee: {id: 3, name: 'Гореньков Аркадий Юрьевич'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 3, work_type: 0, note: '', employee: {id: 3, name: 'Гореньков Аркадий Юрьевич'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 4, work_type: 0, note: '', employee: {id: 4, name: 'Яхин Никита Артемович'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
      {month: 4, day: 12, hours: 4, work_type: 0, note: '', employee: {id: 4, name: 'Яхин Никита Артемович'}, roadmap_item: {id: 1, name: 'Работы в рамках доработок по ЦТ за 2024 год'}},
   ]

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

   const itemTemplate = (item: IFactWorkReport, index: number) => {
      return (
          <div className="col-12" key={product.id}>
              <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                  <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} />
                  <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                      <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                          <div className="text-2xl font-bold text-900">{product.name}</div>
                          <Rating value={product.rating} readOnly cancel={false}></Rating>
                          <div className="flex align-items-center gap-3">
                              <span className="flex align-items-center gap-2">
                                  <i className="pi pi-tag"></i>
                                  <span className="font-semibold">{product.category}</span>
                              </span>
                              <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                          </div>
                      </div>
                      <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                          <span className="text-2xl font-semibold">${product.price}</span>
                          <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

   const listTemplate = (items: Product[]) => {
      if (!items || items.length === 0) return null;

      let list = items.map((product, index) => {
          return itemTemplate(product, index);
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
                        {/* </div><div className={classNames(styles.projectsList)} hidden={!selectedCell}> */}
                        <p>Выполненные работы на дату: <h6 style={{display: "contents"}}>{DateHelper.formatDate(new Date(date.getFullYear(), date.getMonth(), selectedCell?.day))}<sup> *</sup></h6></p>                        
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
