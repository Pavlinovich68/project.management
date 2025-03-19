'use client'
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import styles from "./styles.module.scss";
import CRUD from "@/models/enums/crud-type";
import { useEffect, useState } from "react";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import ItrItemInWork from "./ItrItemInWork";

export interface IProjectsInWork {
   year: number,
   month: number,
   day: number,
   user_id: number,
   readOnly: boolean
}

const ItrProjectsInWork = (params: IProjectsInWork) => {
   const [data, setData] = useState<IRoadmapFactItem[]>([]);

   useEffect(() => {
      getData();
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
      setData(response.data);
   }

   return (
      <div className={classNames('card', styles.workGrid)}>
         {params.readOnly ? <></> : 
            <Toolbar start={<Button icon="pi pi-plus" rounded severity="success" aria-label="Добавить работу"
                     tooltip="Добавить работу" tooltipOptions={{ position: 'top' }} type="button"
                     //onClick={() => create()}
            />}/>
         }
         {
            data.map((item) => <ItrItemInWork key={`fact_work-item-${item.id}`} params={item}/>)
         }
      </div>
   );
};

export default ItrProjectsInWork;
