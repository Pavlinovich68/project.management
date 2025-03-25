'use client'
import styles from "@/app/(main)/workplace/department/projectcalendar/styles.module.scss";
import { ICalendarRow } from "@/models/ICalendar";
import { ICalendarCellExt } from "@/models/ICalendarCellExt";
import { NumberEventCallback } from "@/types/numberEvent";
import { classNames } from "primereact/utils";
import React, { useState } from "react";

const ItrMonthCalendar = ({data, dayClick}:{data: ICalendarRow, dayClick: NumberEventCallback}) => {
   const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate())

   const onDayClick = (e:  React.MouseEvent<HTMLElement>, item: ICalendarCellExt) => {
      if (item.cell.type === 100) return;
      if (e.ctrlKey) {
         dayClick(item.cell.day);
         setSelectedDay(item.cell.day);
      }
   }

   return (
      <React.Fragment>
         <div>
            <div className={classNames(styles.calendarHeader)}>{data.name}</div>
            <div className={classNames('justify-content-center flex-wrap container', styles.dayContainer)}>
               {
                  data?.cells?.map((item) =>
                     <div
                        key={`cell-day-${item.day}`}
                        className={classNames(`flex align-items-center justify-content-center cell-bg-${item.type}
                        cell-text-${item.type}`, styles.cellItem, (item.day === selectedDay && item.type !== 100) ? styles.selectedDayCell : '' )}
                        onClick={(e) => onDayClick(e, {rate_id: data.rate_id, cell: item})}
                     >
                        {item.day}
                     </div>)
               }
            </div>
            <text className={classNames(styles.monthHoursText)}>Рабочих часов: {data.hours}</text>
         </div>
      </React.Fragment>
   );
};

export default ItrMonthCalendar;
