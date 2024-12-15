import React, { useState, useEffect } from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";

const TotalRow = ({year, division_id}:{year: number, division_id: number}) => {   
   return (      
      <React.Fragment>
         <div className={classNames("col-12", styles.block)}> 
            <div className={classNames("card", styles.innerArea)}>
               <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                  <span className="block text-500 font-medium mb-3">Распределение рабочего времени по проектам</span>
               </div>
               <div className={classNames(styles.segmentBar)}>
                  <div className={classNames(styles.segmentEmpty)}></div>
               </div>
            </div>
         </div>
      </React.Fragment>      
   );
};

export default TotalRow;
