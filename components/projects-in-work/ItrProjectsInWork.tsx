'use client'
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import styles from "./styles.module.scss";
import CRUD from "@/models/enums/crud-type";
import { useEffect, useState } from "react";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import ItrItemInWork from "./ItrItemInWork";
import { IProject } from "@/models/IProject";
import { v4 as uuidv4 } from 'uuid';

export interface IProjectsInWork {
   year: number,
   month: number,
   day: number,
   user_id: number,
   readOnly: boolean
}

const ItrProjectsInWork = (params: IProjectsInWork) => {
   const [data, setData] = useState<IRoadmapFactItem[]>([]);
   const [projects, setProjects] = useState<IProject[]>([]);
   const [saveDisabled, setSaveDisabled] = useState<boolean>(true)

   useEffect(() => {
      getData();
      getProjects();
      setSaveDisabled(true);
   }, [params.day])

   const getData = async () => {
      const res = await fetch(`/api/roadmap/fact/crud`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            operation: CRUD.read,
            model: {},
            params: {
               year: params.year,
               month: params.month,
               day: params.day,
               user_id: params.user_id
            }
         }),
         cache: 'force-cache'
      });
      const response = await res.json();      
      const _data:IRoadmapFactItem[] = response.data;
      setData(_data.map(i => {return {...i, uuid: uuidv4()}}));
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
      console.table(item);
      setSaveDisabled(false);
      if (item.is_deleted) {
         const index = data.findIndex(i => i.uuid === item.uuid);
         if (index !== -1) {
            data.splice(index, 1);
            let _data = [...data];
            setData(_data)
         }
      }
   }

   const appendItem = () => {
      const _newItem: IRoadmapFactItem = {
         id: undefined,
         uuid: uuidv4(),
         year: params.year,
         month: params.month,
         day: params.day,
         note: undefined,
         roadmap_item_id: undefined,
         ratio: undefined,
         project_id: undefined,
         employee_id: undefined,
         project_name: undefined,
         is_deleted: false
      }
      let _data = data.map(i => { return {...i}});
      _data.push(_newItem);
      setData(_data);
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
                  />   
               }
            />
         }
         {
            data.map((item) => <ItrItemInWork key={`fact_work-item-${item.id}`} params={item} dropdownList={projects} onChange={changeItems}/>)
         }
      </div>
   );
};

export default ItrProjectsInWork;
