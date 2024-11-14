'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
//import styles from "./styles.module.scss"
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

const Roadmap = () => {
   const controllerName = 'roadmap';
   const model: IRoadmapItemCRUD = {id: undefined, comment: undefined, roadmap_id: undefined, project_id: undefined,
      project_name: undefined, start_date: undefined, end_date: undefined, hours: undefined, developer_qnty: undefined
   };
   const toast = useRef<Toast>(null);
   const [year, setYear] = useState<number>(new Date().getFullYear());
   const {data: session} = useSession();

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }

   const button = (<Button icon="pi pi-plus" className="mr-2"/>);

   if (!session) return;   

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card" style={{position: "relative"}}>
               <h3>Дорожная карта по реализации проектов</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <Toolbar start={button} style={{marginTop: "1rem"}}/>
               <ItrRoadmap year={year} division_id={session.user.division_id}/>
            </div>
         </div>     
         <Toast ref={toast} />
         <ConfirmDialog/>
      </div>
   );
};

export default Roadmap;
