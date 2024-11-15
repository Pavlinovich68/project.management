'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect, Ref, forwardRef, useImperativeHandle} from "react";
import ItrRoadmapRow from "./ItrRoadmapRow";
import { IRoadmapItem, IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import DateHelper from "@/services/date.helpers";
import { ICardRef } from "@/models/ICardRef";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";

const Roadmap = ({year, division_id}:{year: number, division_id: number}) => {   
   const [roadmapData, setRoadmapData] = useState<IRoadmapItem[]>();
   const [scalePoint, setScalePoint] = useState<number>(0);
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      getRoadmapData(year, division_id);
      getPointer(year);
   }, [year])   
   
   const getPointer = (year: number) => {
      const length = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      const day = DateHelper.dayNumber(new Date());
      const value = day / (length / 100);
      setScalePoint(value);
   }

   const getRoadmapData = async (val: number, id: number) => {
      setIsLoaded(true);
      const res = await fetch(`/api/roadmap/projects`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: val,
            division_id: id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setRoadmapData(response.data);
      setIsLoaded(false);
   }

   const createMethod = () => {
      console.log('OK');
   }

   const updateMethod = (item: IRoadmapItemCRUD) => {
      console.log('Update: ', item);
   }

   const deleteMethod = (item: IRoadmapItemCRUD) => {
      console.log('Drop: ', item);
   }

   const viewMethod = (item: IRoadmapItemCRUD) => {
      console.log('View: ', item);
   }

   const button = (<Button icon="pi pi-plus" className="mr-2" onClick={() => createMethod()}/>);

   return (
      <div className="card" style={{position: "relative"}}>
         <Toolbar start={button} style={{marginTop: "1rem"}}/>
         {
            isLoaded ? <i className="pi pi-spin pi-spinner flex align-items-center justify-content-center mt-4" style={{ fontSize: '10rem', color: '#326fd1'}}/> :
            <div className={classNames(styles.roadmapContainer)} style={{zIndex:"1", position:"relative"}}>
               {
                  roadmapData?.map((item) => <ItrRoadmapRow 
                     roadmap_id={item.roadmap_id} 
                     item_id={item.id} 
                     project_id={item.project_id} 
                     project_code={item.project_code} 
                     project_name={item.project_name}
                     update={updateMethod}
                     drop={deleteMethod}
                     view={viewMethod}
                  />)
               }
               <div className={classNames(styles.scale)} style={{pointerEvents: "none"}}>
                  <div className={classNames(styles.scalePointer)} style={{width: `${scalePoint}%`}}/>
               </div>
            </div>
         }
      </div>
   );
};

export default Roadmap;
