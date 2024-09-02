'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const ItrCalendarRow = ({id, name, year, month, days, colors}: {id: number, name: string, year: number, month: number, days?: number, colors: any[]}) => {
   let totalHours = 0;
   return (
      <div className="flex justify-content-center calendar-row">
            <div className="flex align-items-center justify-content-start w-12rem h-2rem font-bold name-cell pl-2">{name}</div>
            {colors.map((day) => {
               let hours = undefined;
               switch (day.exclusion_type) {
                  case 1: {
                     hours = 7;
                     break;
                  }
                  case -1: {
                     hours = 8;
                     break;
                  }
                  default: {
                     hours = 0;
                     break;
                  }
               }
               totalHours += hours;
               return (
                  <div className={classNames("flex align-items-center justify-content-center w-2rem h-2rem font-bold", day.background_class)}>
                     {hours}
                  </div>
               )
            })}
            <div className="flex align-items-center justify-content-end w-4rem h-2rem font-bold name-cell pr-2">
               {totalHours}
            </div>
      </div>
   );
};

export default ItrCalendarRow;
