'use client'
import React, {useRef, useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/organization/roadmap/styles.module.scss"
import { IRoadmapData, IRoadmapSegment } from "@/models/IRoadmapData";
import { classNames } from "primereact/utils";

//LINK - https://codepen.io/ciprian/pen/eYbVRKR
const RoadmapRow = ({data}:{data: IRoadmapData}) => {
   return (
      <div className={classNames(styles.segmentBar)} style={{width:"100%", height:"60px"}}>
         {
            data.segments.map((elem) => {
               return (
                  <div className={classNames(styles.segmentItemWrapper)} style={{width: `${elem.percent??0 * 100}%`, backgroundColor: elem.color}}>
                     <span className={classNames(styles.segmentItemPercentage)}>{elem.percent??0 * 100}%</span>
                     <span className={classNames(styles.segmentItemValue)}>{elem.value.toLocaleString("en-US")}</span>
                     <span className={classNames(styles.segmentItemTitle)}>{elem.title}</span>
                     {elem.title} ({elem.value})
                  </div>
               )
            })
         }
      </div>
   );
};

export default RoadmapRow;
