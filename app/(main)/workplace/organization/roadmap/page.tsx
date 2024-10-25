'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import styles from "./styles.module.scss"
import ItrYearSwitsh from "@/components/ItrYearSwitch";

const Roadmap = () => {
   const [year, setYear] = useState<number>(new Date().getFullYear());

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Дорожная карта по реализации проектов</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <div className={classNames(styles.roadmapContainer)}>
                  {}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Roadmap;
