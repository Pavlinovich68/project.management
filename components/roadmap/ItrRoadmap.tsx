'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import ItrRoadmapRow from "./ItrRoadmapRow";
import styles from "@/app/(main)/workplace/organization/roadmap/styles.module.scss"

interface IResponseItem{
   id: number,
   project: {
      id: number,
      code: string,
      name: string
   }
}

const Roadmap = ({year}:{year: number}) => {   
   const [roadmapData, setRoadmapData] = useState<IResponseItem[]>();
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
            roadmapData?.map((item) => <ItrRoadmapRow year={year} row_id={item.id} project_id={item.project.id} code={item.project.code} name={item.project.name}/>)
         }
      </div>
   );
};

export default Roadmap;
