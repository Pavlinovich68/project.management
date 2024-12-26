'use client'
import React, { useState, useEffect } from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapRowSegmentData } from "@/models/IRoadmapItemSegment";
import { Tooltip } from "primereact/tooltip";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import { itemSignature } from "./roadmap.types";
import { Badge } from "primereact/badge";
import { IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";

//LINK - https://codepen.io/ciprian/pen/eYbVRKR
const RoadmapRow = ({roadmap_id, project_id}:
   {roadmap_id: number, project_id: number}) => {
   
   const [data, setData] = useState<IRoadmapProjectItem>();
   
   useEffect(() => {
      getData();
   }, [roadmap_id, project_id])

   const getData = async () => {
      const res = await fetch(`/api/roadmap/row`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            roadmap_id: roadmap_id,
            project_id: project_id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setData(response.data);
   }

   return (      
      <React.Fragment>
         <Tooltip target=".custom-target-icon"/>
         <div className="text-left mb-1 mt-2 text-sm font-semibold text-500">{data?.project_code}: {data?.project_name}</div>         
         <div className={classNames(styles.controlPointsLayear)}>
            {data?.control_points.map((point) => 
               <div className={classNames(styles.controlPoint)} data-color={point.type} style={{left: `${point.width}%`}}>
                  <Badge className={classNames(styles.badge)}/>
               </div>
            )}
         </div>
         <div className={classNames(styles.segmentBar)}>
            <div className={classNames(styles.segmentEmpty, styles.segmentItemWrapper)} style={{width: `100%`}}>
               <span className={classNames(styles.segmentItemTitle)}>{data?.comment}</span>
               <span className={classNames(styles.segmentItemValue)}>{data?.hours} рабочих часов</span>
               <span className={classNames(styles.segmentItemPercentage)}>Исполнено на {data?.percentage}%</span>
               <div className={classNames(styles.segmentItemPlan)} style={{left: `${data?.start_width}%`, width: `${data?.plan_width}%`}}></div>
               <div className={classNames(styles.segmentItemFact)} style={{left: `${data?.start_width}%`, width: `${data?.fact_width}%`}}></div>
            </div>
         </div>
      </React.Fragment>      
   );
};

export default RoadmapRow;
