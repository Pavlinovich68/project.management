'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import ItrRoadmapRow from "./ItrRoadmapRow";
import { IRoadmapItem } from "@/models/IRoadmapItem";
import styles from "@/app/(main)/workplace/organization/roadmap/styles.module.scss"

const Roadmap = ({year}:{year: number}) => {   
   const [roadmapData, setRoadmapData] = useState<IRoadmapItem[]>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);


   useEffect(() => {
      getRoadmapData(year);
   }, [year])

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
      <div className={classNames(styles.roadmapContainer)}>
         {
            roadmapData?.map((item) => <ItrRoadmapRow roadmap_id={item.roadmap_id} item_id={item.id} project_id={item.project_id} project_code={item.project_code} project_name={item.project_name}/>)
         }
      </div>
   );
};

export default Roadmap;
