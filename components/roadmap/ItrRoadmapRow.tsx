'use client'
import React, {useRef, useState, useEffect, Ref} from "react";
import styles from "@/app/(main)/workplace/department/roadmap/styles.module.scss"
import { classNames } from "primereact/utils";
import { IRoadmapRowSegmentData } from "@/models/IRoadmapItemSegment";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";
import ItrCard from "../ItrCard";
import { ICardRef } from "@/models/ICardRef";
import { FormikErrors, useFormik } from "formik";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import crudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";

//LINK - https://codepen.io/ciprian/pen/eYbVRKR
const RoadmapRow = ({roadmap_id, item_id, project_id, project_code, project_name, card}:
   {roadmap_id: number, item_id: number, project_id: number, project_code: string, project_name: string, card: React.JSX.Element}) => {
   
   const controllerName = 'roadmap';
   const model: IRoadmapItemCRUD = {id: undefined, comment: undefined, roadmap_id: undefined, project_id: undefined,
      project_name: undefined, start_date: undefined, end_date: undefined, hours: undefined, developer_qnty: undefined
   };
   const toast = useRef<Toast>(null);
   const [data, setData] = useState<IRoadmapRowSegmentData>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const editor = useRef<ICardRef>(null);
   
   useEffect(() => {
      getSegments();
   }, [roadmap_id, project_id])

   const getSegments = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/roadmap/row`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            roadmap_id: roadmap_id,
            project_id: project_id
         }),
         cache: 'force-cache'
      });
      const response = await res.json();
      setData(response.data);
      setIsLoading(false);
   }

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

   //#region //SECTION CRUD
const updateMethod = (id: number) => {
   console.log(`update ${id}`)
   //FIXME - Получить модель по id с сервера 
   roadmapItem.setValues(model);
   if (editor.current) {
      editor.current.visible(true);
   }
}
//FIXME - Поправить диалог
const deleteMethod = async (id: number) => {
   console.log(`delete ${id}`)
   //return await crudHelper.crud(controllerName, CRUD.delete, { id: data.id });
}
const viewMethod = (id: number) => {
   console.log(`view ${id}`)
}

const confirmDelete = (id: number) => {   
   confirmDialog({
      message: `Вы уверены что хотите удалить элемент?`,
      header: 'Удаление элемента',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      showHeader: true,
      accept: () => deleteMethod(id)
   });
};

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
      <React.Fragment>
         <Tooltip target=".custom-target-icon" position="bottom"/>
         <div className="text-left mb-1 mt-2 text-sm font-semibold text-500">{project_code}: {project_name}</div>
         <div className={classNames(styles.segmentBar)}>
            {            
               data?.segments?.map((elem) => 
                     <React.Fragment>
                        <div className={classNames(elem.type === 1 ? styles.segmentItemPlan : styles.segmentEmpty, styles.segmentItemWrapper)} style={{width: `${elem.percent??0 * 100}%`}}>
                           {elem.type === 1 ? <span className={classNames(styles.segmentItemTitle)}>{elem.name}</span> : ''}
                           <span className={classNames(styles.segmentItemValue)}>{elem.type === 1 ? elem.value?.toLocaleString("en-US") + ' дней, ' + elem.hours + ' рабочих часов.' : ''}</span>
                           {elem.type === 1 ? <div className={classNames(styles.segmentItemFact)} style={{width: `${elem.fact?.percent}%`}}></div> : ''}
                           {elem.type === 1 ?                            
                              <div className={classNames("flex justify-content-end flex-wrap", styles.buttonBar)}>
                                 <i className={classNames("custom-target-icon pi pi-eye flex align-items-center justify-content-center", styles.button)}
                                    data-pr-tooltip="Просмотреть атрибуты элемента"
                                    data-pr-position="top"
                                    style={{cursor:"pointer"}}
                                    onClick={() => viewMethod(elem.id)}                                    
                                 ></i>
                                 <i className={classNames("custom-target-icon pi pi-pencil flex align-items-center justify-content-center", styles.button)}
                                    data-pr-tooltip="Редактировать атрибуты элемента"
                                    data-pr-position="top"
                                    style={{cursor:"pointer"}}
                                    onClick={() => updateMethod(elem.id)}
                                 ></i>
                                 <i className={classNames("custom-target-icon pi pi-trash flex align-items-center justify-content-center", styles.button)}
                                    data-pr-tooltip="Удалить элемент"
                                    data-pr-position="top"
                                    style={{cursor:"pointer"}}
                                    onClick={() => confirmDelete(elem.id)}
                                 ></i>
                              </div> 
                           : ''}
                        </div>
                     </React.Fragment>
               )
            }
            {data?.points.map((item) => <div className={classNames(styles.point)} style={{width:`calc(${item.value}% - 40px)`, borderRightColor: `${item.color}`}}></div>)}
         </div>
         <ItrCard
            header={'Внесение изменений в элемент плана'}
            width={'35vw'}
            save={saveMethod}
            hiddenSave={false}
            body={card}
            ref={editor}
         />         
         {/* <Toast ref={toast} /> */}
      </React.Fragment>      
   );
};

export default RoadmapRow;
