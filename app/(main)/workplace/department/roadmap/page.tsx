'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
//import styles from "./styles.module.scss"
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import { Toast } from "primereact/toast";
import { ICardRef } from "@/models/ICardRef";
import RecordState from "@/models/enums/record-state";
import { FormikErrors, useFormik } from "formik";
import crudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import ItrCard from "@/components/ItrCard";
import { ConfirmDialog } from "primereact/confirmdialog";

const Roadmap = () => {
   const controllerName = 'roadmap';
   const model: IRoadmapItemCRUD = {id: undefined, comment: undefined, roadmap_id: undefined, project_id: undefined,
      project_name: undefined, start_date: undefined, end_date: undefined, hours: undefined, developer_qnty: undefined
   };
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [year, setYear] = useState<number>(new Date().getFullYear());
   const {data: session} = useSession();

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }

   const startContent = (
         <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" onClick={() => createMethod()}/>
         </React.Fragment>
   );

//#region //SECTION CARD
   const roadmapItem = useFormik<IRoadmapItemCRUD>({
      initialValues: model,
      validate: (data) => {
         let errors: FormikErrors<IRoadmapItemCRUD> = {};
         if (!data.project_id){
            errors.project_id = "Проект должен быть указан!";
         }
         if (!data.start_date){
            errors.start_date = "Ориентировочная дата начала работ по проекту должна быть заполнена!";
         }
         if (!data.end_date){
            errors.end_date = "Ориентировочная дата окончания работ по проекту должна быть заполнена!";
         }
         if (!data.hours){
            errors.hours = "Ориентировочная трудоемкость должна быть указана!";
         }
         if (!data.developer_qnty){
            errors.developer_qnty = "Плановая численность разработчиков должна быть указана!";
         }
         return errors;
      },
      onSubmit: () => {
      }
   });

   if (!session) return;

   const card = (
      <div className="card p-fluid">
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
         <div className="p-fluid formgrid grid">         
         </div>
      </div>
   )
//#endregion //!SECTION CARD

//#region //SECTION CRUD
   const createMethod = () => {
      roadmapItem.setValues(model);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const saveMethod = async () => {
      if (!roadmapItem.isValid) {
         const errors = Object.values(roadmapItem.errors);
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
            await crudHelper.crud(controllerName, CRUD.create, roadmapItem.values);

         setIsLoading(false);

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            //FIXME - Добавить обновление доски
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

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card" style={{position: "relative"}}>
               <h3>Дорожная карта по реализации проектов</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <Toolbar start={startContent} style={{marginTop: "1rem"}}/>
               <ItrRoadmap year={year} division_id={session.user.division_id} card={card}/>
            </div>
         </div>
         <ItrCard
            header={'Создание нового элемента плана'}
            width={'35vw'}
            save={saveMethod}
            hiddenSave={false}
            body={card}
            ref={editor}
         />         
         <Toast ref={toast} />
         <ConfirmDialog/>
      </div>
   );
};

export default Roadmap;
