'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { ICalendarFooter } from "@/models/ICalendar";

const ItrCalendarFooter = ({footer}:{footer: ICalendarFooter | null | undefined}) => {
   return (
      <div className={classNames("flex justify-content-center", styles.calendarFooter)}>
         <div className={classNames("flex vertical-align-middle w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl, styles.cellBb, styles.cellBr, styles.calendarLeftCell)}>
            {footer?.name}
         </div>
         {
            footer?.hours?.map((day) => {
               return (
                  <div key="calendar-footer" className={classNames("flex align-items-center justify-content-center font-bold", styles.dataCell, styles.cellBr, styles.cellBb, styles.cellVertical)}>
                     {day.hours}
                  </div>
               )
            })
         }
         <div className={classNames("w-4rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
            {footer?.sum?.toLocaleString()}
         </div>
         <div className={classNames("w-6rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
            {footer?.total?.toLocaleString()}
         </div>
      </div>
   );
};

export default ItrCalendarFooter;
