'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import ItrRoadmapRow from "./ItrRoadmapRow";
import { IRoadmapItem } from "@/models/IRoadmapItem";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import DateHelper from "@/services/date.helpers";

const Roadmap = ({year}:{year: number}) => {   
   const [roadmapData, setRoadmapData] = useState<IRoadmapItem[]>();
   const [scalePoint, setScalePoint] = useState<number>(0);
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      getRoadmapData(year);
      getPointer(year);
   }, [year])

   const getPointer = (year: number) => {
      const length = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      const day = DateHelper.dayNumber(new Date());
      const value = day / (length / 100);
      setScalePoint(value);
   }

   const getRoadmapData = async (val: number) => {
      setIsLoaded(true);
      const res = await fetch(`/api/roadmap/projects`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: val}),
         cache: 'force-cache'
      });
      const response = await res.json();
      setRoadmapData(response.data);
      setIsLoaded(false);
   }

   return (
      <React.Fragment>
         {
            isLoaded ? <i className="pi pi-spin pi-spinner flex align-items-center justify-content-center mt-4" style={{ fontSize: '10rem', color: '#326fd1'}}/> :
            <div className={classNames(styles.roadmapContainer)} style={{zIndex:"1", position:"relative"}}>
               {
                  roadmapData?.map((item) => <ItrRoadmapRow roadmap_id={item.roadmap_id} item_id={item.id} project_id={item.project_id} project_code={item.project_code} project_name={item.project_name}/>)
               }
               <div className={classNames(styles.scale)}>
                  <div className={classNames(styles.scalePointer)} style={{width: `${scalePoint}%`}}/>
               </div>
            </div>
         }
      </React.Fragment>
   );
};

export default Roadmap;
