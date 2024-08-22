'use client'
import { TargetValue } from "@/models/TargetValue";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import styles from './styles.module.scss';
import trafficLight from "@/models/enums/traffic_light";
import { TargetYearValue } from "@/models/TargetYearValue";
import SentimentSatisfied from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfied from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfied from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';

const ItrTargetValue = ({data}: {data: TargetValue}) => {
   const [yearValues, setYearValues] = useState<TargetYearValue[]>([]);
   useEffect(()=> {
      setYearValues(data.values);
   }, [data.values]);
   const colorizeRow = () => {
      switch (data.trafficLight) {
         case trafficLight.green:
            return "bg-green-400";
         case trafficLight.yellow:
            return "bg-yellow-400 text-black-alpha-80";
         default:
            return "bg-red-400";
      }
   }
   const icon = (state: trafficLight) => {
      switch (state) {
         case trafficLight.green: return  <SentimentSatisfied style={{fontSize: "48px"}} className="text-green-300"/>;
         case trafficLight.yellow: return  <SentimentDissatisfied style={{fontSize: "48px"}} className="text-yellow-300"/>;
         case trafficLight.red: return  <SentimentVeryDissatisfied style={{fontSize: "48px"}} className="text-red-300"/>;
      }
   }
   return (
      <div className="grid">
         <div className="col-1 vertical-align-middle text-center" style={{fontSize: "48px"}}>
            {icon(data.trafficLight)}
         </div>
         <div className="col-9">
            <div className="border-bottom-1 border-200 pb-1">{data.name}</div>
            <div className={data.isVariation ? "text-red-400 font-italic text-sm pb-1" : "text-red-400 font-italic text-sm pb-1 hidden"}>Отклонение в процентном выражении: {data.percentVariation}%</div>
            <div className={data.isVariation ? "text-red-400 font-italic text-sm pb-1" : "text-red-400 font-italic text-sm pb-1 hidden"}>Отклонение в натуральном выражении: {data.unitVariation}</div>
            <div className={classNames("text-sm pb-1", data.isVariation ? "text-red-400" : "text-green-400", data.note ? "border-bottom-1 border-200" : "")}>{data.deviationCauses}</div>
            <div className="text-sm text-blue-300">{data.note}</div>
         </div>
         <div className="col-2 p-0">
            <table className={styles.targetYearValueTable}>
               <tr className="surface-100">
                  <td className={styles.tdHeader}>Период</td>
                  <td className={styles.tdHeader}>План</td>
                  <td className={styles.tdHeader}>Факт</td>
               </tr>
               <tbody>
                  {yearValues.map((item) => {return <tr key={item.id} className={classNames(item.year === new Date().getFullYear() ? "surface-300" : "")}>
                     <td className="hidden">{item.id}</td>
                     <td className={styles.tdRowCenter}>{item.year}</td>
                     <td className={classNames("pr-1", styles.tdRowRight)}>{item.plan}</td>
                     <td className={classNames("pr-1", styles.tdRowRight)}>{item.fact}</td>
                  </tr>})}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default ItrTargetValue;
