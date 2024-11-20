'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
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
import {confirmDialog} from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { TreeNode } from "primereact/treenode";
import { IProjectNode } from "@/models/IProjectNode";
import { IBaseEntity } from "@/models/IBaseEntity";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";

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
   const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>(null);
   const [nodes, setNodes] = useState<IProjectNode[]>([]);
   const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

   useEffect(() => {
      getRoadmapData(year, division_id);
      getPointer(year);
   }, [year])   

   const getProjectTree = async () => {
      const response = await crudHelper.crud('project', CRUD.read, {});
      setNodes(response.data);
   }
   
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
   <div className={classNames("card p-fluid", styles.card)}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">
         {recordState === RecordState.ready ? 
            <React.Fragment>
               <div className="field col-12">
                  <label htmlFor="name">Проект</label>
                  <div className={classNames(styles.fieldValue)}>{row.values.project_name}</div>
               </div>
               <div className="field col-12">
                  <label htmlFor="name">Наименование работ</label>
                  <div className={classNames(styles.fieldValue)}>{row.values.comment}</div>
               </div>               
               <div className="field col-12 md:col-6">
                  <label htmlFor="begin_date">Дата начала</label>
                  <div className={classNames(styles.fieldValue)}>{DateHelper.formatDate(row.values.start_date)}</div>
               </div>
               <div className="field col-12 md:col-6">
                  <label htmlFor="end_date">Дата окончания</label>
                  <div className={classNames(styles.fieldValue)}>{DateHelper.formatDate(row.values.end_date)}</div>
               </div>
               <div className="field col-6">
                  <label htmlFor="hours">Плановое количество часов</label>
                  <div className={classNames(styles.fieldValue)}>{row.values.hours}</div>
               </div>
               <div className="field col-6">
                  <label htmlFor="developer_qnty">Плановая численность</label>
                  <div className={classNames(styles.fieldValue)}>{row.values.developer_qnty}</div>
               </div>
            </React.Fragment> : 
            <React.Fragment>
               <div className="field col-12">
                  <label htmlFor="name">Проект</label>
                  <TreeSelect 
                     value={selectedNodeKey}
                     options={nodes}
                     filter
                     onChange={(e : TreeSelectChangeEvent) => {
                        //@ts-ignore
                        setSelectedNodeKey(e.value)
                        //@ts-ignore
                        row.setFieldValue('project_id', parseInt(e.value));
                     }}
                  />
               </div>
               <div className="field col-12">
                  <label htmlFor="name">Наименование работ</label>
                  <InputText id="name"  placeholder="Наименование работ"
                                       className={classNames({"p-invalid": submitted && !row.values.comment})}
                                       value={row.values.comment}
                                       onChange={(e) => row.setFieldValue('comment', e.target.value)} required autoFocus type="text"/>
               </div>               
               <div className="field col-12 md:col-6">
                  <label htmlFor="begin_date">Дата начала</label>
                  <Calendar id="begin_date" className={classNames({"p-invalid": submitted && !row.values.start_date})} value={new Date(row.values.start_date as Date)} onChange={(e) => row.setFieldValue('start_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата начала"/>
               </div>
               <div className="field col-12 md:col-6">
                  <label htmlFor="end_date">Дата окончания</label>
                  <Calendar id="end_date" value={row.values.end_date !== null ? new Date(row.values.end_date as Date) : null} onChange={(e) => row.setFieldValue('end_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата окончания"/>
               </div>
               <div className="field col-6">
                  <label htmlFor="hours">Плановое количество часов</label>
                  <InputNumber id="hours"  placeholder="Плановое количество часов"
                                       className={classNames({"p-invalid": submitted && !row.values.hours})}
                                       value={row.values.hours}
                                       onValueChange={(e) => row.setFieldValue('hours', e.value)} required autoFocus/>
               </div>
               <div className="field col-6">
                  <label htmlFor="developer_qnty">Плановая численность</label>
                  <InputNumber id="developer_qnty"  placeholder="Плановая численность привлеченных разработчиков"
                                       className={classNames({"p-invalid": submitted && !row.values.developer_qnty})}
                                       value={row.values.developer_qnty}
                                       onValueChange={(e) => row.setFieldValue('developer_qnty', e.value)} required autoFocus/>
               </div>
            </React.Fragment>}
      </div>
   </div>
)
//#endregion //!SECTION CARD
//#region //!SECTION CRUD
   const createMethod = async () => {
      console.log('Create');
      setCardHeader('Создание нового элемента плана');
      await getProjectTree();
      setSelectedNodeKey(null);
      row.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = async (item: IRoadmapItemCRUD) => {
      console.log('Update: ', item);
      setCardHeader('Редактирование элемента плана');
      await getProjectTree();
      row.setValues(item);
      setSelectedNodeKey(item.project_id?.toString()??null);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const viewMethod = async (item: IRoadmapItemCRUD) => {
      setCardHeader('Просмотр элемента плана');
      await getProjectTree();
      row.setValues(item);
      setSelectedNodeKey(item.project_id?.toString()??null);
      setRecordState(RecordState.ready);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteMethod = (item: IRoadmapItemCRUD) => {      
      confirmDialog({
         message: `Вы уверены что хотите удалить запись?`,
         header: 'Удаление записи',
         icon: 'pi pi-exclamation-triangle text-red-500',
         acceptLabel: 'Да',
         rejectLabel: 'Нет',
         showHeader: true,
         accept: () => {
            console.log('Drop: ', item);
         }
      });
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
            hiddenSave={recordState === RecordState.ready}
            body={card}
            ref={editor}            
         />         
         <Toast ref={toast} />
      </div>
   );
};

export default Roadmap;
