'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
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

   if (!session) return;   

   return (
      <React.Fragment>
         <h3>Дорожная карта по реализации проектов</h3>
         <ItrYearSwitsh year={year} onChange={changeYear}/>
         <ItrRoadmap year={year} division_id={session.user.division_id}/>            
         <Toast ref={toast} />
         <ConfirmDialog/>
      </React.Fragment>
   );
};

export default Roadmap;
