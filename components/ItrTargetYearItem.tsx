'use client'
import { TargetYearValue } from "@/models/TargetYearValue";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import React, {useRef, useState, useEffect, forwardRef, Ref, RefObject} from "react";
import styles from './styles.module.scss';
import { classNames } from "primereact/utils";

const TargetYearItem = ({item, onChangeItem}: {item: TargetYearValue, onChangeItem: any}) => {
   const [readOnlyPlan, setReadOnlyPlan] = useState<boolean>(true);
   const [readOnlyFact, setReadOnlyFact] = useState<boolean>(true);

   const updatePlanValue = (evt: any) => {
      item.plan = evt.value;
   }

   const updateFactValue = (evt: any) => {
      item.fact = evt.value;
   }

   return (
      <div className="p-inputgroup flex-1 w-full" data-target-year-opened={!readOnlyPlan || !readOnlyFact}>
         <span className="p-inputgroup-addon surface-100 font-bold">
            {item.year}
         </span>
         <span className="p-inputgroup-addon">
            План
         </span>
         <InputNumber 
            placeholder="Значение не указано" 
            className={classNames(styles.textRight)} 
            value={item.plan}
            onChange={evt => updatePlanValue(evt)}
            readOnly={readOnlyPlan}/>
         <Button 
            type="button" 
            icon={readOnlyPlan ? "pi pi-lock" : "pi pi-unlock"} 
            className={classNames("text-white-alpha-90", readOnlyPlan ? "bg-red-700" : "bg-red-300")} 
            onClick={()=>{
               const state = readOnlyPlan;
               setReadOnlyPlan(!readOnlyPlan);
               if (!state) {
                  onChangeItem(item);
               }
            }}/>
         <span className="p-inputgroup-addon">
            Факт
         </span>
         <InputNumber 
            placeholder="Значение не указано" 
            className={classNames(styles.textRight)} 
            value={item.fact}
            onChange={evt => updateFactValue(evt)}
            readOnly={readOnlyFact}/>
         <Button 
            type="button" 
            icon={readOnlyFact ? "pi pi-lock" : "pi pi-unlock"} 
            className={classNames("text-white-alpha-90", readOnlyFact ? "bg-red-700" : "bg-red-300")}
            onClick={()=>{
               const state = readOnlyFact;
               setReadOnlyFact(!readOnlyFact);
               if (!state) {
                  onChangeItem(item);
               }
            }}/>
      </div>
   );
};

export default TargetYearItem;
