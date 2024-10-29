'use client'
import React, {useRef, useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/organization/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapItemSegment } from "@/models/IRoadmapItemSegment";

//LINK - https://codepen.io/ciprian/pen/eYbVRKR
const RoadmapRow = ({id, project_id, project_code, project_name}:{id: number, project_id: number, project_code: string, project_name: string}) => {
   const [data, setData] = useState<IRoadmapItemSegment[]>();

   return (
      <div className={classNames(styles.segmentBar)} style={{width:"100%", height:"60px"}}>
         {
            // data?.map((elem) => {
            //    return (
            //       <div className={classNames(styles.segmentItemWrapper)} style={{width: `${elem.percent??0 * 100}%`, backgroundColor: elem.color}}>
            //          <span className={classNames(styles.segmentItemPercentage)}>{elem.percent??0 * 100}%</span>
            //          <span className={classNames(styles.segmentItemValue)}>{elem.value.toLocaleString("en-US")}</span>
            //          <span className={classNames(styles.segmentItemTitle)}>{elem.title}</span>
            //          {elem.title} ({elem.value})
            //       </div>
            //    )
            // })
         }
      </div>
   );
};

export default RoadmapRow;
