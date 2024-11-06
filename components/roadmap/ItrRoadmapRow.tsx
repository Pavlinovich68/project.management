'use client'
import React, {useRef, useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapItemSegment } from "@/models/IRoadmapItemSegment";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

//LINK - https://codepen.io/ciprian/pen/eYbVRKR
const RoadmapRow = ({roadmap_id, item_id, project_id, project_code, project_name}:{roadmap_id: number, item_id: number, project_id: number, project_code: string, project_name: string}) => {
   const [data, setData] = useState<IRoadmapItemSegment[]>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      getSegments();
   }, [roadmap_id, project_id])

   const getSegments = async () => {
      setIsLoaded(true);
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
      setIsLoaded(false);
   }

   return (      
      <React.Fragment>
         <Tooltip target=".custom-target-icon" position="bottom"/>
         <div className="text-left mb-1 mt-2 text-sm font-semibold text-500">{project_code}: {project_name}</div>
         <div className={classNames(styles.segmentBar)}>         
            {            
               data?.map((elem) =>
                     <React.Fragment>
                        <div className={classNames(elem.type === 1 ? styles.segmentItemPlan : styles.segmentEmpty, styles.segmentItemWrapper)} style={{width: `${elem.percent??0 * 100}%`}}>
                           {elem.type === 1 ? <span className={classNames(styles.segmentItemTitle)}>{elem.name}</span> : ''}
                           <span className={classNames(styles.segmentItemValue)}>{elem.type === 1 ? elem.value?.toLocaleString("en-US") + ' дней, ' + elem.hours + ' рабочих часов.' : ''}</span>
                           {elem.type === 1 ?                            
                              <div className={classNames("flex justify-content-end flex-wrap", styles.buttonBar)}>
                                 <i className={classNames("custom-target-icon pi pi-eye flex align-items-center justify-content-center", styles.button)}
                                    data-pr-tooltip="Просмотреть атрибуты элемента"
                                    style={{cursor:"pointer"}}
                                 ></i>
                                 <i className={classNames("custom-target-icon pi pi-pencil flex align-items-center justify-content-center", styles.button)}
                                    data-pr-tooltip="Редактировать атрибуты элемента"
                                    style={{cursor:"pointer"}}
                                 ></i>
                                 <i className={classNames("custom-target-icon pi pi-trash flex align-items-center justify-content-center", styles.button)}
                                    data-pr-tooltip="Удалить элемент"
                                    style={{cursor:"pointer"}}
                                 ></i>
                              </div> 
                           : ''}
                        </div>
                        {elem.type === 1 ? <div className={classNames(styles.segmentItemFact)}></div> : ''}
                     </React.Fragment>
               )
            }
         </div>                  
      </React.Fragment>      
   );
};

export default RoadmapRow;
