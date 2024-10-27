'use client'
import React, {useRef, useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/organization/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { IconPencil } from "@tabler/icons-react";

const RoadmapRow = ({year, row_id, project_id, code, name}:{year: number, row_id: number, project_id: number, code: string, name: string}) => {
   return (
      <div className={classNames(styles.roadmapRow)}>
         <div className={classNames(styles.dataItem)}>
         </div>
      </div>
   );
};

export default RoadmapRow;
