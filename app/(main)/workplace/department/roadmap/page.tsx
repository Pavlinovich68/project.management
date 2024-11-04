'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
//import styles from "./styles.module.scss"
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";

const Roadmap = () => {
   const [year, setYear] = useState<number>(new Date().getFullYear());

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }

   const startContent = (
         <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />   
            <Button icon="pi pi-print" className="mr-2" />
            <Button icon="pi pi-upload" />
         </React.Fragment>
   );

   

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card" style={{position: "relative"}}>
               <h3>Дорожная карта по реализации проектов</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <Toolbar start={startContent} style={{marginTop: "1rem"}}/>
               <ItrRoadmap year={year}/>               
            </div>
         </div>
      </div>
   );
};

export default Roadmap;
