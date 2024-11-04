'use client'
import { useSession } from "next-auth/react";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/ProjectCalendar/styles.module.scss"
import React, {useRef, useState, useEffect} from "react";

interface ICalendarDataItem {
   id: number | undefined,
   month: number | undefined,
   day: number,
   hours: number | undefined,
   type: number,
   row_id: number | undefined
}

const ItrMonthCalendar = ({employee_id, year, month}:{employee_id: number, year: number, month: number}) => {
   const toast = useRef<Toast>(null)
   const {data: session} = useSession()
   const [isLoaded, setIsLoaded] = useState<boolean>(false)
   const [calendarData, setCalendarData] = useState<ICalendarDataItem[]>()

   useEffect(()=>{
      getCalendarData();
   }, [employee_id, year, month])

   const getCalendarData = async () => {
      //@ts-ignore
      if (!session?.user?.employee_id) {
         toast.current?.show({severity:'error', summary: 'Сессия приложения', detail: 'Идентификатор сотрудника недоступен!', life: 3000});
         return;
      }
      setIsLoaded(true);
      const res = await fetch(`/api/calendar/department/month`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            //@ts-ignore
            employee_id: employee_id, 
            year: year, 
            month: month
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setCalendarData(response.data);
      setIsLoaded(false);
   }

   const onDayClick = (e:  React.MouseEvent<HTMLElement>, item: ICalendarDataItem) => {
      if (item.type === 100) return;
      if (e.ctrlKey) {
         console.log(item);
      }
   }

   return (
      <React.Fragment>
         <div className={classNames('justify-content-center flex-wrap, container', styles.dayContainer)}>
            {               
               calendarData?.map((item) => <div className={
                  classNames(`flex align-items-center justify-content-center cell-bg-${item.type} cell-text-${item.type}`, styles.cellItem)
               } onClick={(e) => onDayClick(e, item)}>{item.day}</div>) 
            }
         </div>
         <Toast ref={toast} />
      </React.Fragment>
      
   );
};

export default ItrMonthCalendar;
