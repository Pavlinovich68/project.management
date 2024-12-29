'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { useSession } from "next-auth/react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import ItrTotalRow from "@/components/roadmap/ItrTotalRow";
import { IRoadmapProjectItem } from "@/models/IRoadmapProjectItem";

interface IBalanceData {
   plan: number,
   fact: number,
   total: number,
   available: number,
   lack: number
}

const Roadmap = () => {
   const [year, setYear] = useState<number>(new Date().getFullYear());
   const [balanceData, setBalanceData] = useState<IBalanceData>()
   const [projectsData, setProjectsData] = useState<IRoadmapProjectItem[]>()
   const {data: session} = useSession();

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
      getBalanceData(val).then((i) => setBalanceData(i));
      getProjectsData().then((i) => setProjectsData(i))
   }

   const getBalanceData = async (_year: number): Promise<IBalanceData> => {
      const res = await fetch(`/api/roadmap/balance`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: _year,
            division: session?.user.division_id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      return response.data;      
   }

   const getProjectsData = async (): Promise<IRoadmapProjectItem[]> => {
      const res = await fetch(`/api/roadmap/row`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: year,
            division: session?.user.division_id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      return response.data;
   }

   if (!session) return;
   if (!projectsData) return;

   const balanceWidget = (_year: number) => {
      const percentPlan = () => {
         if (!balanceData?.plan || balanceData?.plan === 0) return 0;
         return Math.round((balanceData?.plan??0) / (balanceData.total) * 10000) / 100;
      };
      const percentFact = () => {
         if (!balanceData?.plan || balanceData?.plan === 0) return 0;
         return Math.round((balanceData?.fact??0) / (balanceData.plan) * 10000) / 100;
      };
      return (
         <>
            <div className={classNames("col-12 lg:col-3", styles.block)}>
               <div className={classNames("card", styles.innerArea)}>
                  <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                     <span className="block text-500 font-medium mb-3">Рабочее время</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValue)}>{balanceData?.total.toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>человеко/часов всего</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValue)}>{balanceData?.available.toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>доступно</span>
                  </div>
                  {
                     (balanceData?.lack??0) > 0 ?
                        <div className={classNames(styles.indicator)}>
                           <span className={classNames(styles.indicatorValueBad)}>{balanceData?.lack.toLocaleString()}</span>
                           <span className={classNames(styles.indicatorCaption)}>дефицит (вакансии)</span>
                        </div> :
                        <></>
                  }
               </div>               
            </div>
            <div className={classNames("col-12 lg:col-3", styles.block)}>
               <div className={classNames("card", styles.innerArea)}>
                  <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                     <span className="block text-500 font-medium mb-3">Спланировано</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValue, styles.fontLarge)}>{balanceData?.plan.toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>человеко/часов</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValue, styles.fontLarge)}>{percentPlan().toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>%</span>
                  </div>
               </div>
            </div>
            <div className={classNames("col-12 lg:col-3", styles.block)}>
               <div className={classNames("card", styles.innerArea)}>
                  <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                     <span className="block text-500 font-medium mb-3">Исполнение плана</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValue, styles.fontLarge)}>{balanceData?.fact.toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>человеко/часов</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValue, styles.fontLarge)}>{percentFact().toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>%</span>
                  </div>
               </div>               
            </div>
            <div className={classNames("col-12 lg:col-3", styles.block)}>
               <div className={classNames("card", styles.innerArea)}>
                  <div className={classNames("flex justify-content-between mb-3", styles.caption)}>
                     <span className="block text-500 font-medium mb-3">Неспланировано</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValueBad, styles.fontLarge)}>{((balanceData?.total??0) - (balanceData?.plan??0)).toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>человеко/часов</span>
                  </div>
                  <div className={classNames(styles.indicator)}>
                     <span className={classNames(styles.indicatorValueBad, styles.fontLarge)}>{(Math.round((100 - ((balanceData?.plan??0) / (balanceData?.total??0) * 100)) * 100) / 100).toLocaleString()}</span>
                     <span className={classNames(styles.indicatorCaption)}>%</span>
                  </div>
               </div>
            </div>
         </>         
      ) 
   }

   return (
      <React.Fragment>
         <h3>Дашборд процессов подразделения</h3>         
         <ItrYearSwitsh year={year} onChange={changeYear}/>
         <div className={classNames("grid", styles.dashboard)}>
            {balanceWidget(year)}
            <ItrTotalRow year={year} division_id={session.user.division_id}/>
            {
               projectsData?.map((item, i) =>
                     <div className={classNames("col-4", styles.block)}> 
                        <div className={classNames("card", styles.innerArea)}>
                           <div className="text-left mt-1 text-sm font-semibold text-500">{item?.project_code}: {item?.project_name}</div>
                           <div className="text-left mb-2 text-sm text-400">{item?.comment}</div>
                           <div className={classNames(styles.segmentBar)}>
                              <div className={classNames(styles.segmentEmpty, styles.segmentItemWrapper)} style={{width: `100%`}}>
                                 {/* <span className={classNames(styles.segmentItemValue)}>{item?.hours} рабочих часов</span>
                                 <span className={classNames(styles.segmentItemPercentage)}>Исполнено на {item?.percentage}%</span> */}
                                 <div className={classNames(styles.segmentItemPlan)} style={{left: `${item?.start_width}%`, width: `${item?.plan_width}%`}}></div>
                                 <div className={classNames(styles.segmentItemFact)} style={{left: `${item?.start_width}%`, width: `${item?.fact_width}%`}}></div>
                              </div>
                           </div>                           
                        </div>
                     </div>
               )
            }
         </div>         
      </React.Fragment>
   );
};

export default Roadmap;
