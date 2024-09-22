'use client'
import React, {useRef, useState, useEffect, cache, SyntheticEvent} from "react";
import { classNames } from "primereact/utils";
import styles from "@/app/(main)/workplace/department/calendar/styles.module.scss"
import { Toast } from "primereact/toast";
import { ICalendar } from "@/models/ICalendar";
import { Session } from "next-auth";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Dropdown } from "primereact/dropdown";

interface Exclusion {
   value: number,
   name: string
}

const ItrCalendar = ({year, month, division_id, session}: {year: number, month: number, division_id: number, session: Session}) => {
   const toast = useRef<Toast>(null);
   const [data, setData] = useState<ICalendar>();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [cardHeader, setCardHeader] = useState<string>('');
   const [cardVisible, setCardVisible] = useState<boolean>(false);
   const [selectedExclusion, setSelectedExclusion] = useState<Exclusion | null>(null);
   const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

   const exclusions: Exclusion[] = [
      {name: 'Выходной',               value: 0},
      {name: 'Сокращенный',            value: 1},
      {name: 'Перенесенный выходной',  value: 2},
      {name: 'Перенесенный рабочий',   value: 3},
      {name: 'Рабочий',                value: 4},
      {name: 'Отпуск',                 value: 5},
      {name: 'Больничный',             value: 6},
      {name: 'Без содержания',         value: 7},
      {name: 'Прогул',                 value: 8},
      {name: 'Вакансия',               value: 9},
      {name: 'Работа в выходной',      value: 10},
   ];

   useEffect(() => {
      getCalendarData();
   }, [year, month, division_id]);

   const getCalendarData = async () => {
      if (!division_id) {
         toast.current?.show({severity:'error', summary: 'Сессия приложения', detail: 'Идентификатор подразделения недоступен!', life: 3000});
         return;
      }
      setIsLoaded(true);
      const res = await fetch(`/api/calendar/department/read`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            division: division_id, 
            year: year, 
            month: month}),
         cache: 'force-cache'
      });
      const data = await res.json();
      setData(data.data);
      setIsLoaded(false);
   }

   const getCardHeader = async (id: number) => {
      const res = await fetch(`/api/calendar/department/cell_prop?id=${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
         cache: 'force-cache'
      });
      const data = await res.json();
      setSelectedExclusion(null);
      setCardHeader(`Исключение для ${data.data.name} на дату ${data.data.date}`);
   }

   const saveCellType = async () => {
      const el = document.getElementById(`calendar-cell-id-${selectedId}`);
      el?.classList.remove('cell-0');
      el?.classList.remove('cell-1');
      el?.classList.remove('cell-2');
      el?.classList.remove('cell-3');
      el?.classList.remove('cell-4');
      el?.classList.remove('cell-5');
      el?.classList.remove('cell-6');
      el?.classList.remove('cell-7');
      el?.classList.remove('cell-8');
      el?.classList.remove('cell-9');
      el?.classList.remove('cell-10');
      el?.classList.add(`cell-${selectedExclusion}`);
      setSelectedId(undefined);
      
      await fetch(`/api/calendar/department/update_cell`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            id: selectedId, 
            type: selectedExclusion}),
         cache: 'force-cache'
      });
      setCardVisible(false);
      getCalendarData();
   }

   //@ts-ignore
   if (data === 'Календарь не обнаружен!' || isLoaded) 
      return <React.Fragment/>

   const checkRoles = (arr: string[]):boolean => {
      const userRoles = session?.user?.roles;
      if (!userRoles) {
         return false;
      }
      const roles = Object.keys(userRoles);
      const intersection = arr.filter(x => roles.includes(x));
      return intersection.length > 0
   }

   const onCellClick = async (id: number, e: SyntheticEvent) => {
      if (!checkRoles(['master'])) {
      }    
      await getCardHeader(id);
      setSelectedId(id);
      setCardVisible(true);
   }

   const confirmSave = (event: any) => {
      confirmPopup({
         target: event.currentTarget,
         message: (
            <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
                  <i className="pi pi-exclamation-circle text-6xl text-primary-500"></i>
                  <span>Вы действительно хотите изменить тип выбранного дня?</span>
            </div>
         ),
         defaultFocus: 'accept',
         accept: saveCellType
      });
   }

   const dialogFooter = (
      <div className="itr-dialog-footer">
         <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={() => {setCardVisible(false);}}/>
         <Button label="Сохранить" icon="pi pi-check" autoFocus onClick={confirmSave} type="submit"/>
         <ConfirmPopup/>
      </div>
   );

   return (
      <React.Fragment>         
            <div className={classNames('card', styles.monthCalendar)} style={{marginTop: "1em"}}>
               <div className={classNames("flex justify-content-center", styles.calendarHeader)}>
                  <div className={classNames("flex align-items-center justify-content-center w-8rem font-bold", styles.cellHeader, styles.cellBl, styles.cellBt, styles.cellBr)}>
                     {data?.header?.name}
                  </div>
                  {
                     data?.header?.days?.map((day) => {                        
                        return (
                           <div key="calendar-header" className={classNames("flex align-items-center justify-content-center font-bold", styles.dataCell, styles.cellBt, styles.cellBr)}>
                              {day}
                           </div>
                        )
                     })
                  }
                  <div className={classNames("flex align-items-center justify-content-center w-4rem font-bold", styles.cellHeader, styles.cellBr, styles.cellBt)}>
                     {data?.header?.hours}
                  </div>
                  <div className={classNames("flex align-items-center justify-content-center w-6rem font-bold", styles.cellHeader, styles.cellBr, styles.cellBt)}>
                     {data?.header?.total}
                  </div>
               </div>
               {
                  data?.rows?.map((row) => {
                     return (
                        <div key="row" className={classNames("flex justify-content-center", styles.calendarRow)}>
                           <div className={classNames("flex align-items-start justify-content-start w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl)}>{row.name}</div>
                           {
                              row?.cells?.map((day) => {
                                 let cellClass = styles.dataCell;
                                 switch (day.type) {
                                    case 0: cellClass = "cell-0"; break;
                                    case 1: cellClass = "cell-1"; break;
                                    case 2: cellClass = "cell-2"; break;
                                    case 3: cellClass = "cell-3"; break;
                                    case 4: cellClass = "cell-4"; break;
                                    case 5: cellClass = "cell-5"; break;
                                    case 6: cellClass = "cell-6"; break;
                                    case 7: cellClass = "cell-7"; break;
                                    case 8: cellClass = "cell-8"; break;
                                    case 9: cellClass = "cell-9"; break;
                                    case 10: cellClass = "cell-010"; break;
                                 }
                                 return (
                                    <div id={`calendar-cell-id-${day.id}`} key={`calendar-cell-id-${day.id}`} onClick={(e) => onCellClick(day.id, e)} className={classNames("flex align-items-center justify-content-center w-4rem font-bold", styles.dataCell, cellClass)}>{day.hours}</div>
                                 )
                              })
                           }
                           <div className={classNames("flex align-items-end justify-content-end w-4rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.hours}</div>
                           <div className={classNames("flex align-items-end justify-content-end w-6rem pr-2 font-bold", styles.cellHeader, styles.cellBr)}>{row.total?.toLocaleString()}</div>
                        </div>
                     )
                  })
               }
               <div className={classNames("flex justify-content-center", styles.calendarFooter)}>
                  <div className={classNames("flex vertical-align-middle w-8rem font-bold pl-2", styles.cellHeader, styles.cellBl, styles.cellBb, styles.cellBr, styles.calendarLeftCell)}>
                     {data?.footer?.name}
                  </div>
                  {
                     data?.footer?.hours?.map((day) => {
                        return (
                           <div key="calendar-footer" className={classNames("flex align-items-center justify-content-center font-bold", styles.dataCell, styles.cellBr, styles.cellBb, styles.cellVertical)}>
                              {day}
                           </div>
                        )
                     })
                  }
                  <div className={classNames("w-4rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
                     {data?.footer?.sum?.toLocaleString()}
                  </div>
                  <div className={classNames("w-6rem font-bold pr-2 text-right", styles.cellBr, styles.cellBb, styles.calendarLeftCell)}>
                     {data?.footer?.total?.toLocaleString()}
                  </div>
               </div>
            </div>
            <Dialog
               className="itr-dialog"
               header={cardHeader}               
               visible={cardVisible}
               style={{width: 600}}
               footer={dialogFooter}
               onHide={()=> setCardVisible(false)}>
               <div className="card flex justify-content-center">
                  <Dropdown 
                     value={selectedExclusion} 
                     onChange={(e) => setSelectedExclusion(e.value)}                        
                     options={exclusions} 
                     optionLabel="name" 
                     optionValue="value"
                     placeholder="Выберите тип исключения" 
                     className="w-full" 
                     highlightOnSelect={true}
                  />
               </div>
            </Dialog>
            <Toast ref={toast} />
      </React.Fragment>
   );
};

export default ItrCalendar;
