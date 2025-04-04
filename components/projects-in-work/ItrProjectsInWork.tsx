'use client'
import { IProject } from "@/models/IProject";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ItrItemInWork from "./ItrItemInWork";
import styles from "./styles.module.scss";
import { BooleanEventCallback } from "@/types/booleanEvent";
import { ICalendarCell } from "@/models/ICalendar";
import { Toast } from "primereact/toast";


export interface IProjectsInWork {
   year: number,
   month: number,
   cell: ICalendarCell | undefined,
   user_id: number,
   readOnly: boolean,
   saveEvent: BooleanEventCallback
}

const ItrProjectsInWork = (params: IProjectsInWork) => {
   const [data, setData] = useState<IRoadmapFactItem[]>([]);
   const [projects, setProjects] = useState<IProject[]>([]);
   const [saveDisabled, setSaveDisabled] = useState<boolean>(true)
   const [employeeId, setEmployeeId] = useState<number>(0)
   const toast = useRef<Toast>(null);

   useEffect(() => {
      setData([]);
      getData();
      getProjects();
      setSaveDisabled(true);
   }, [params.cell?.day])

   const getData = async () => {
      const res = await fetch(`/api/roadmap/fact/read`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            params: {
               year: params.year,
               month: params.month,
               day: params.cell?.day,
               user_id: params.user_id
            }
         }),
         cache: 'force-cache'
      });
      const response = await res.json();      
      const _data:IRoadmapFactItem[] = response.data;
      setData(_data.map(i => {return {...i, uuid: uuidv4()}}));
      setEmployeeId(response.employee_id);
   }

   const getProjects = async () => {
      const res = await fetch(`/api/roadmap/fact/dropdown`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: params.year
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setProjects(response.data);
   }

   
   
   const changeItems = (item: IRoadmapFactItem) => {      
      console.clear();
      console.log('До:')
      console.table(data);
      setSaveDisabled(false);      
      let _data = [...data];
      const index = _data.findIndex(i => i.uuid === item.uuid);
      if (index !== -1) {
         _data[index] = {...item}
      } else {
         _data.push(item);
      }
      setData(_data);
      console.log('После:')
      console.table(_data);
   }

   const appendItem = () => {
      const _newItem: IRoadmapFactItem = {
         id: undefined,
         uuid: uuidv4(),
         year: params.year,
         month: params.month,
         day: params.cell?.day??-1,
         note: undefined,
         roadmap_item_id: undefined,
         ratio: undefined,
         project_id: undefined,
         employee_id: employeeId,
         project_name: undefined,
         is_deleted: false
      }
      let _data = data.map(i => { return {...i}});
      _data.push(_newItem);
      setData(_data);
      console.clear();
      console.table(_data);
   }

   const save = async () => {
      if (!check()) return;
      const res = await fetch(`/api/roadmap/fact/update`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            items: data
         }),
         cache: 'force-cache'
      });
      const response = await res.json();      
      const _data:IRoadmapFactItem[] = response.data;
      setData(_data.map(i => {return {...i, uuid: uuidv4()}}));
      setSaveDisabled(true);
      params.saveEvent(true);
   }

   const check = (): boolean => {
      const total: number = (params.cell?.hours)??0;
      try {
         let hours = 0;
         for (const item of data) {
            if (!item.project_id) throw Error('Не указан проект')
            if (item.note === '' || item.note === undefined) throw Error('Не указанны выполненные работы')
            if (!item.ratio || item.ratio === 0) throw Error('Не указанно затраченное на выполнение работ время')
            hours += item.ratio;
            if (hours > total) throw Error('Превышено рабочее время')
         }
      } catch (error) {
         toast.current?.show({
            severity: "error",
            summary: "Ошибка валидации",
            //@ts-ignore
            detail: error.message,
            life: 5000
         });
         return false;
      }
      return true;
   }

   return (
      <div className={classNames('card', styles.workGrid)}>
         {params.readOnly ? <></> : 
            <Toolbar 
               start={
                  <Button 
                     icon="pi pi-plus" 
                     rounded 
                     severity="success" 
                     aria-label="Добавить работу"
                     tooltip="Добавить работу" 
                     tooltipOptions={{ position: 'top' }} 
                     type="button"
                     onClick={() => appendItem()}
                  />
               }
               end={
                  <Button 
                     icon="pi pi-save" 
                     rounded
                     disabled={saveDisabled} 
                     severity="warning"
                     aria-label="Сохранить изменения"
                     tooltip="Сохранить изменения" 
                     tooltipOptions={{ position: 'top' }} 
                     type="button"
                     onClick={() => save()}
                  />   
               }
            />
         }
         <div>
            {
               data.filter(i => i.is_deleted === false).map((item) => {
                  console.log(item);
                  return <ItrItemInWork key={`fact_work-item-${item.id}`} params={item} dropdownList={projects} onChange={changeItems}/>
               })
            }
         </div>
         <Toast ref={toast} />       
      </div>
   );
};

export default ItrProjectsInWork;
