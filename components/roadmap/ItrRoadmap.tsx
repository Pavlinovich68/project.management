'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import ItrRoadmapRow from "./ItrRoadmapRow";
import { IRoadmapData } from "@/models/IRoadmapData";
import styles from "@/app/(main)/workplace/organization/roadmap/styles.module.scss"

const Roadmap = ({year}:{year: number}) => {   
   const [roadmapData, setRoadmapData] = useState<IRoadmapData[]>();
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
            roadmapData?.map((item) => <ItrRoadmapRow data={item}/>)
         }
      </div>
   );
};

export default Roadmap;
