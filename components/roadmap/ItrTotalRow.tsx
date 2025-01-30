import React, { useState, useEffect } from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapDataItem } from "@/models/IRoadmapData";
import { ColorPicker } from "primereact/colorpicker";
import { Tooltip } from "primereact/tooltip";

interface ITimeScaleElement {
   month: number,
   value: number,
   left: number
   length: number
}
const months: {[Key: number]: string} = {
   0: 'Январь',
   1: 'Февраль',
   2: 'Март',
   3: 'Апрель',
   4: 'Май',
   5: 'Июнь',
   6: 'Июль',
   7: 'Август',
   8: 'Сентябрь',
   9: 'Октябрь',
   10: 'Ноябрь',
   11: 'Декабрь',
}
const TotalRow = ({year, division_id}:{year: number, division_id: number}) => {
   const [data, setData] = useState<IRoadmapDataItem[]>([]);
   const [scale, setScale] = useState<ITimeScaleElement[]>([]);
   const [hours, setHours] = useState<ITimeScaleElement[]>([]);
   
   useEffect(() => {
      getTotalData();
      setHours([]);
   }, [year, division_id])

   const getTotalData = async () => {
      const res = await fetch(`/api/roadmap/total`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: year,
            division: division_id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setData(response.data);
      setScale(response.scale);
      calcScale(response.hours, 100);
   }

   const calcScale = (val: number, step: number) => {
      let n = 0;
      const result: ITimeScaleElement[] = [];
      while (n <= val) {
         const item: ITimeScaleElement = {
            month: 0,
            value: 0,
            left: n / val * 100,
            length: step / val * 100
         }
         result.push(item);
         n += step;         
      }
      setHours(result);
   }

   return (      
      <React.Fragment>
         <Tooltip target=".total-row-segment"/>
         <div className={classNames("col-12", styles.block)}> 
            <div className={classNames("card", styles.innerArea)}>
               <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                  <span className="block text-500 font-medium mb-3">Спланированные проекты на шкале времени в ч/ч</span>
               </div>
               <div className={classNames(styles.segmentBar)}>
                  <div className={classNames(styles.segmentEmpty)}>
                     {
                        data?.map((segment) => 
                           <div className={classNames('total-row-segment', styles.totalRowSegment)} style={{zIndex: 2, left: `${segment?.left}%`, width: `${segment?.length}%`}}>
                              {segment.project_code}
                           </div>
                        )
                     }
                  </div>
               </div>
               <div className={classNames(styles.hoursScale)}>
                  {
                     hours.map((i) => <div className={classNames(styles.scaleItem)} style={{left: `${i.left}%`, width: `${i.length}%`}}></div>)
                  }
               </div>
               <div className={classNames(styles.scaleBar)}>
                  {
                     scale?.map((i) => <div className={classNames(styles.scaleItem)} style={{left: `${i.left}%`, width: `${i.length}%`}}>{months[i.month]} <sup>{i.value}</sup></div>)
                  }
               </div>
            </div>
         </div>
      </React.Fragment>      
   );
};

export default TotalRow;
