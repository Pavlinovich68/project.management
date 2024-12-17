import React, { useState, useEffect } from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapDataItem } from "@/models/IRoadmapData";
import { ColorPicker } from "primereact/colorpicker";
import { Tooltip } from "primereact/tooltip";

const TotalRow = ({year, division_id}:{year: number, division_id: number}) => {
   const [data, setData] = useState<IRoadmapDataItem[]>();
   
   useEffect(() => {
      getTotalData();
   }, [year, division_id])

   const getTotalData = async () => {
      const res = await fetch(`/api/roadmap/total`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: year,
            division: division_id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setData(response.data);    
   }

   const tooltipData = (segmentData: IRoadmapDataItem) => {

   }

   return (      
      <React.Fragment>
         <Tooltip target=".total-row-segment"/>
         <div className={classNames("col-12", styles.block)}> 
            <div className={classNames("card", styles.innerArea)}>
               <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                  <span className="block text-500 font-medium mb-3">Распределение рабочего времени по проектам</span>
               </div>
               <div className={classNames(styles.segmentBar)}>
                  <div className={classNames(styles.segmentEmpty)}>
                     {
                        data?.map((segment) => 
                           <div className={classNames('total-row-segment', styles.totalRowSegment)} data-pr-tooltip="Просмотреть атрибуты элемента"
                              data-pr-position="top" style={{zIndex: 2, left: `${segment?.left}%`, width: `${segment?.length}%`}}/>
                        )
                     }
                  </div>
               </div>
            </div>
         </div>
      </React.Fragment>      
   );
};

export default TotalRow;
