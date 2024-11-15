'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect, Ref, forwardRef, useImperativeHandle} from "react";
import ItrRoadmapRow from "./ItrRoadmapRow";
import { IRoadmapItem, IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import DateHelper from "@/services/date.helpers";
import { ICardRef } from "@/models/ICardRef";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import ItrCard from "../ItrCard";
import { FormikErrors, useFormik } from "formik";
import crudHelper from "@/services/crud.helper";
import RecordState from "@/models/enums/record-state";
import CRUD from "@/models/enums/crud-type";
import { Toast } from "primereact/toast";

const Roadmap = ({year, division_id}:{year: number, division_id: number}) => {
   const model: IRoadmapItemCRUD = {
      id: undefined,
      comment: undefined,
      roadmap_id: undefined,
      project_id: undefined,
      project_name: undefined,  
      start_date: undefined,
      end_date: undefined,
      hours: undefined,
      developer_qnty: undefined
   }
   const [roadmapData, setRoadmapData] = useState<IRoadmapItem[]>();
   const [scalePoint, setScalePoint] = useState<number>(0);
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [cardHeader, setCardHeader] = useState<string>('');
   const [submitted, setSubmitted] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);

   useEffect(() => {
      getRoadmapData(year, division_id);
      getPointer(year);
   }, [year])   
   
   const getPointer = (year: number) => {
      const length = new Date(year, 2, 0).getDate() === 28 ? 365 : 366;
      const day = DateHelper.dayNumber(new Date());
      const value = day / (length / 100);
      setScalePoint(value);
   }

   const getRoadmapData = async (val: number, id: number) => {
      setIsLoaded(true);
      const res = await fetch(`/api/roadmap/projects`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            year: val,
            division_id: id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setRoadmapData(response.data);
      setIsLoaded(false);
   }

//#region //SECTION CARD
const row = useFormik<IRoadmapItemCRUD>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IRoadmapItemCRUD> = {};
      if (!data.comment){
         errors.comment = "ФИО должно быть заполнено!";
      }
      // if (!data.email){
      //    errors.email = "Адрес электронной почты должен быть указан!";
      // }
      // if (!data.begin_date){
      //    errors.begin_date = "Дата начала действия должна быть заполнена!";
      // }
      return errors;
   },
   onSubmit: () => {
      row.resetForm();
   }
});

const card = (
   <div className="card p-fluid">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">         
      </div>
   </div>
)
//#endregion //!SECTION CARD
//#region //!SECTION CRUD
   const createMethod = () => {
      console.log('OK');
      setCardHeader('Создание нового элемента плана');
      row.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = (item: IRoadmapItemCRUD) => {
      console.log('Update: ', item);
   }

   const deleteMethod = (item: IRoadmapItemCRUD) => {
      console.log('Drop: ', item);
   }

   const viewMethod = (item: IRoadmapItemCRUD) => {
      console.log('View: ', item);
   }

   const saveMethod = async () => {
      setSubmitted(true);
      if (!row.isValid) {
         const errors = Object.values(row.errors);
         //@ts-ignore
         toast.current.show({
            severity:'error',
            summary: 'Ошибка сохранения',
            content: (<div className="flex flex-column">
                        <div className="text-center mb-2">
                           <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                           <h3 className="text-red-500">Ошибка сохранения</h3>
                        </div>
                  {errors.map((item, i) => {
                     return (
                        // eslint-disable-next-line react/jsx-key
                        <p className="flex align-items-left m-0">
                           {/* @ts-ignore */}
                           {item}
                        </p>)
                  })
               }
            </div>),
            life: 5000
         });
         return;
      }
      try {
         setIsLoading(true);
         const res = 
            await crudHelper.crud('roadmap', recordState === RecordState.new ? CRUD.create : CRUD.update, row.values);
   
         setIsLoading(false);
   
         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            // if (grid.current) {
            //    grid.current.reload();
            // }
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
//#endregion //!SECTION CRUD

   const button = (<Button icon="pi pi-plus" className="mr-2" onClick={() => createMethod()}/>);

   return (
      <div className="card" style={{position: "relative"}}>
         <Toolbar start={button} style={{marginTop: "1rem"}}/>
         {
            isLoaded ? <i className="pi pi-spin pi-spinner flex align-items-center justify-content-center mt-4" style={{ fontSize: '10rem', color: '#326fd1'}}/> :
            <div className={classNames(styles.roadmapContainer)} style={{zIndex:"1", position:"relative"}}>
               {
                  roadmapData?.map((item) => <ItrRoadmapRow 
                     roadmap_id={item.roadmap_id} 
                     item_id={item.id} 
                     project_id={item.project_id} 
                     project_code={item.project_code} 
                     project_name={item.project_name}
                     update={updateMethod}
                     drop={deleteMethod}
                     view={viewMethod}
                  />)
               }
               <div className={classNames(styles.scale)} style={{pointerEvents: "none"}}>
                  <div className={classNames(styles.scalePointer)} style={{width: `${scalePoint}%`}}/>
               </div>
            </div>
         }
         <ItrCard
            header={cardHeader}
            width={'35vw'}
            save={saveMethod}
            hiddenSave={false}
            body={card}
            ref={editor}
         />         
         <Toast ref={toast} />
      </div>
   );
};

export default Roadmap;
