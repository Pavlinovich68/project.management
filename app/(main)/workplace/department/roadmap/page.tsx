'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { useSession } from "next-auth/react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";

interface IBalanceData {
   plan: number,
   fact: number,
   total: number,
   ratio: number
}

const Roadmap = () => {
   const [year, setYear] = useState<number>(new Date().getFullYear());
   const {data: session} = useSession();

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }

   const balanceData = async (_year: number): Promise<IBalanceData> => {
      const res = await fetch(`/api/roadmap/balance`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: year
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      return response.data;      
   }

   if (!session) return;

   const balanceElement = async (_year: number) => {
      const _data = await balanceData(_year);
      return (
         <div className={classNames("col-12 lg:col-6", styles.block)}>
            <div className={classNames("card", styles.innerArea)}>
               <span className={classNames("block text-500 font-medium mb-3")}>Баланс рабочего времени</span>
               <div>{_data.total.toLocaleString()}</div>
            </div>               
         </div>
      ) 
   }

   return (
      <React.Fragment>
         <h3>Дашборд процессов подразделения</h3>         
         <ItrYearSwitsh year={year} onChange={changeYear}/>
         <div className={classNames("grid", styles.dashboard)}>
            {balanceElement(year)}
            <div className={classNames("col-6 lg:col-3", styles.block)}>
               <div className={classNames("card")}>
               </div>               
            </div>
            <div className={classNames("col-6 lg:col-3", styles.block)}>
               <div className={classNames("card")}>
               </div>               
            </div>
            <ItrRoadmap year={year} division_id={session.user.division_id}/>
         </div>         
      </React.Fragment>
   );
};

export default Roadmap;
