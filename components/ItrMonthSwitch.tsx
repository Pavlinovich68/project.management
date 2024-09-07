import { Button } from "primereact/button";
import React, {useState} from "react";

const ItrCalendarSwitch = ({xdate, onClick}: {xdate: Date, onClick: any}) => {
   const [date, setDate] = useState<Date>(xdate)

   const getMonthName = () => {
      const str = date.toLocaleString('default', { month: 'long' });
      return `${str.charAt(0).toUpperCase() + str.slice(1)} ${date.getFullYear()}`;
   }

   const addMonth = async (cnt: number) => {
      const _date = new Date(date.setMonth(date.getMonth() + cnt));
      setDate(_date);
      onClick(_date);
   }

   const buttonClick = async (cnt : number) => {
      await addMonth(cnt);
   }

   return (
      <div className="p-inputgroup calendar-switch flex justify-content-center flex-wrap">
         <Button icon="pi pi-arrow-left" onClick={() => buttonClick(-1)}/>
         <div className="center-area">{`${getMonthName()}`}</div>
         <Button icon="pi pi-arrow-right" onClick={() => buttonClick(1)}/>
      </div>   
   );
};

export default ItrCalendarSwitch;
