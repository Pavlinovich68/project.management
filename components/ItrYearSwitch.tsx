'use client'
import { Button } from "primereact/button";
import React, {useRef, useState, useEffect} from "react";

const ItrYearSwitsh = ({year, onChange}: {year: number, onChange: any}) => {
   const [currentYear, setCurrentYear] = useState<number>(year)

   const buttonClick = (cnt : number) => {
      const _year = currentYear + cnt;
      setCurrentYear(_year);
      onChange(_year);
   }

   return (
      <div className="p-inputgroup calendar-switch flex justify-content-center flex-wrap">
         <Button icon="pi pi-arrow-left" onClick={() => buttonClick(-1)}/>
         <div className="center-area">{currentYear}</div>
         <Button icon="pi pi-arrow-right" onClick={() => buttonClick(1)}/>
      </div>   
   );
};

export default ItrYearSwitsh;
