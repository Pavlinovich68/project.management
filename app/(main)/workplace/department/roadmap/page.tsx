'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { useSession } from "next-auth/react";

const Roadmap = () => {
   const [year, setYear] = useState<number>(new Date().getFullYear());
   const {data: session} = useSession();

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }

   if (!session) return;   

   return (
      <React.Fragment>
         <h3>Дорожная карта по реализации проектов</h3>
         <ItrYearSwitsh year={year} onChange={changeYear}/>
         <ItrRoadmap year={year} division_id={session.user.division_id}/>
      </React.Fragment>
   );
};

export default Roadmap;
