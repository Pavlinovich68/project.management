'use client'
import React, {useRef, useState, useEffect} from "react";

const ItrCalendarRow = ({id, name, year, month, days}: {id: number, name: string, year: number, month: number, days?: number}) => {
   return (
      <div className="flex justify-content-center calendar-row">
            <div className="flex align-items-center justify-content-start w-12rem h-2rem font-bold name-cell pl-2">{name}</div>
            {Array.from(Array(days).keys()).map((day) => {
               return (
                  <div className="flex align-items-center justify-content-center w-2rem h-2rem font-bold cell">
                     {day+1}
                  </div>
               )
            })}
            <div className="flex align-items-center justify-content-end w-4rem h-2rem font-bold name-cell pr-2">
               123
            </div>
      </div>
   );
};

export default ItrCalendarRow;
