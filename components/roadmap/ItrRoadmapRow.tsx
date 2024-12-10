'use client'
import React, { useState, useEffect } from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapRowSegmentData } from "@/models/IRoadmapItemSegment";
import { Tooltip } from "primereact/tooltip";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import { itemSeignature } from "./roadmap.types";
import { Badge } from "primereact/badge";
import { IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";

//LINK - https://codepen.io/ciprian/pen/eYbVRKR
const RoadmapRow = ({roadmap_id, project_id, update, drop, view}:
   {roadmap_id: number, project_id: number, update: any, drop: any, view: any}) => {
   
   const [data, setData] = useState<IRoadmapProjectItem>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   
   useEffect(() => {
      getData();
   }, [roadmap_id, project_id])

   const getData = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
   }

   const itemMethod = (fn: itemSeignature, id: number | undefined) => {
      const item = getCRUDItem(id);
      return fn(item);
   }

   const getCRUDItem = (id: number | undefined): IRoadmapItemCRUD | undefined => {
      return undefined//data?.items.find((item) => item.id === id);
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
               <div className={classNames(styles.segmentItemPlan)} style={{left: `${data?.start_width}%`, width: `${data?.plan_width}%`}}></div>
               <div className={classNames(styles.segmentItemFact)} style={{left: `${data?.start_width}%`, width: `${data?.fact_width}%`}}></div>
               <div className={classNames("flex justify-content-end flex-wrap", styles.buttonBar)}>
                  <i className={classNames("custom-target-icon pi pi-eye flex align-items-center justify-content-center", styles.button)}
                     data-pr-tooltip="Просмотреть атрибуты элемента"
                     data-pr-position="top"
                     style={{cursor:"pointer"}}
                     onClick={() => itemMethod(view, data?.roadmap_item_id)}                                    
                  ></i>
                  <i className={classNames("custom-target-icon pi pi-pencil flex align-items-center justify-content-center", styles.button)}
                     data-pr-tooltip="Редактировать атрибуты элемента"
                     data-pr-position="top"
                     style={{cursor:"pointer"}}
                     onClick={() => itemMethod(update, data?.roadmap_item_id)}
                  ></i>
                  <i className={classNames("custom-target-icon pi pi-trash flex align-items-center justify-content-center", styles.button)}
                     data-pr-tooltip="Удалить элемент"
                     data-pr-position="top"
                     style={{cursor:"pointer"}}
                     onClick={() => itemMethod(drop, data?.roadmap_item_id)}
                  ></i>
               </div>
            </div>
         </div>
         {/* <div className={classNames(styles.segmentBar)}>
            {            
               data?.segments?.map((elem) => 
                     <React.Fragment>
                        <div className={classNames(elem.type === 1 ? styles.segmentItemPlan : styles.segmentEmpty, styles.segmentItemWrapper)} style={{width: `${elem.percent??0 * 100}%`}}>
                           {elem.type === 1 ? <span className={classNames(styles.segmentItemTitle)}>{elem.name}</span> : ''}
                           <span className={classNames(styles.segmentItemValue)}>{elem.type === 1 ? elem.value?.toLocaleString("en-US") + ' дней, ' + elem.hours + ' рабочих часов.' : ''}</span>
                           {elem.type === 1 ? <div className={classNames(styles.segmentItemFact)} style={{width: `${elem.fact?.percent}%`}}></div> : ''}
                           {elem.type === 1 ?                            
                               
                           : ''}
                        </div>
                     </React.Fragment>
               )
            }
         </div> */}
      </React.Fragment>      
   );
};

export default RoadmapRow;
