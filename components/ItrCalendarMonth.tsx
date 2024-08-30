'use client'
import React, {useRef, useState, useEffect} from "react";

const ItrCalendarMonth = ({month}: {month: number}) => {
   interface IMonthProps<T> { [index: string]: T };
   type Month = {name: string, quarter: string};
   const monthProps: IMonthProps<Month> = {
      1:    {name: "Январь",   quarter: ""},
      2:    {name: "Февраль",  quarter: ""},
      3:    {name: "Март",     quarter: ""},
      4:    {name: "Апрель",   quarter: ""},
      5:    {name: "Май",      quarter: ""},
      6:    {name: "Июнь",     quarter: ""},
      7:    {name: "Июль",     quarter: ""},
      8:    {name: "Август",   quarter: ""},
      9:    {name: "Сентябрь", quarter: ""},
      10:   {name: "Октябрь",  quarter: ""},
      11:   {name: "Ноябрь",   quarter: ""},
      12:   {name: "Декабрь",  quarter: ""},
   }
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>{monthProps[month].name}</h3>
            </div>
         </div>
      </div>
   );
};

export default ItrCalendarMonth;
