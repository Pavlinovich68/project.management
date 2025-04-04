'use client'
import { classNames } from "primereact/utils";
import React, {useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { ICalendarFooter } from "@/models/ICalendar";

const ItrCalendarFooter = ({footerData, flag, sum, total}:{footerData: ICalendarFooter | null | undefined, flag: boolean, sum: number, total: number}) => {
   const [footer, setFooter] = useState<ICalendarFooter | undefined | null>(footerData);
   const [sumValue, setSumValue] = useState<number>(sum);
   const [totalValue, setTotalValue] = useState<number>(total);

   useEffect(()=>{
      setFooter(footerData);
      setSumValue(sum);
      setTotalValue(total);
   }, [flag, sum, total])

   return (
      <div className={classNames("flex justify-content-center", styles.calendarFooter)}>
         <div className={classNames("flex vertical-align-middle w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl, styles.cellBb, styles.cellBr, styles.calendarLeftCell)}>
            {footer?.name}
         </div>
         {
            footer?.hours?.map((day) => {
               return (
                  <div className={classNames("flex align-items-center justify-content-center font-bold", styles.dataCell, styles.cellBr, styles.cellBb, styles.cellVertical)}>
                     {day.hours}
                  </div>
               )
            })
         }
         <div className={classNames("w-4rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
            {sumValue.toLocaleString()}
         </div>
         <div className={classNames("w-6rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
            {totalValue.toLocaleString()}
         </div>
      </div>
   );
};

export default ItrCalendarFooter;
