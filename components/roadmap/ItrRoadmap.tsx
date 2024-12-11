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
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { IProjectNode } from "@/models/IProjectNode";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { TabPanel, TabView } from "primereact/tabview";
import { Chip } from "primereact/chip";
import { IControlPoint } from "@/models/IRoadmapItemSegment";
import { DataView } from "primereact/dataview";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";
import { IconPin } from '@tabler/icons-react';

const Roadmap = ({year, division_id}:{year: number, division_id: number}) => {
   const controllerName: string = 'roadmap/projects';
   const model: IRoadmapItemCRUD = {
      id: 0,
      comment: '',
      roadmap_id: 0,
      project_id: 0,
      project_name: undefined,
      hours: 0,
      is_closed: false,
      control_points: []
   }
   const [roadmapData, setRoadmapData] = useState<IRoadmapItem[]>();
   const [roadmapId, setRoadmapId] = useState<number>(0);
   const [scalePoint, setScalePoint] = useState<number>(0);
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const [cardHeader, setCardHeader] = useState<string>('');
   const [controlPointHeader, setControlPointHeader] = useState<string>('');
   const [submitted, setSubmitted] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [controlPointState, setControlPointState] = useState<RecordState>(RecordState.ready);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const controlPointEditor = useRef<ICardRef>(null);
   const [selectedNodeKey, setSelectedNodeKey] = useState<string | null>(null);
   const [nodes, setNodes] = useState<IProjectNode[]>([]);
   const [readOnly, setReadOnly] = useState<boolean>(false);

   useEffect(() => {
      getRoadmapData(year, division_id);
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
      const res = await crudHelper.crud(controllerName, CRUD.read, {}, {year: val, division_id: id});
      setRoadmapData(res.data.items);
      setRoadmapId(res.data.roadmap_id);
      setIsLoaded(false);
      getPointer(year);
   }

   const acceptItemFact = async (id: number) => {
      await fetch(`/api/roadmap/projects/finish`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            id: id
         }),
         cache: 'force-cache'
      });
   }

//#region //SECTION CARD
const row = useFormik<IRoadmapItemCRUD>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IRoadmapItemCRUD> = {};
      if (!data.project_id){
         errors.project_id = "Укажите проект  работ!";
      }
      if (!data.comment){
         errors.comment = "Укажите наименование работ!";
      }
      if (!data.hours){
         errors.hours = "Укажите плановую трудоемкость!";
      }
      return errors;
   },
   onSubmit: () => {
      row.resetForm();
   }
});

interface ITypeDictionary {
   [key: number]: string
}
const pointTypes: ITypeDictionary = {
   1: 'Предоставление требований',
   2: 'Подготовка ТЗ',
   3: 'Согласование ТЗ',
   4: 'Предварительные испытания',
   5: 'Опытная эксплуатация',
   6: 'Приемочные испытания',
   7: 'Ввод в эксплуатацию',
   8: 'Прочее'
}

const pointItemTemplate = (cp: IControlPoint, index: number) => {
   return <div className="col-6">
            <div className={classNames("card m-1", styles.itemCard)}>
               <div className="flex justify-content-between mb-1">
                  <Tag value={pointTypes[cp.type??8]} className={classNames(styles.typeTag)} data-color={cp.type}/>                  
                  <div className="flex align-items-center justify-content-center">
                     {readOnly ? <></> : <>
                        <i className="pi pi-pencil text-blue-200 text-xs mr-1" />
                        <i className="pi pi-trash text-blue-200 text-xs" />
                     </>
                     }
                  </div>
               </div>
               <span className="text-500 flex">{cp.name}</span>
               <span className="text-500 flex">{DateHelper.formatDate(cp.date)}</span>
            </div>
         </div>
};

const pointListTemplate = (items: IControlPoint[]) => {
   if (!items || items.length === 0) return null;

   let list = items.map((product, index) => {
      return pointItemTemplate(product, index);
   });

   return <div className={classNames("grid grid-nogutter", styles.controlPointItem)}>{list}</div>;
}

const viewCard = (
   <TabView>
      <TabPanel header="Основные данные">
         <div className="p-fluid formgrid grid">
            <div className="field col-12">
               <label htmlFor="name">Проект</label>
               <div className={classNames(styles.fieldValue)}>{row.values.project_name}</div>
            </div>
            <div className="field col-12">
               <label htmlFor="name">Наименование работ</label>
               <div className={classNames(styles.fieldValue)}>{row.values.comment}</div>
            </div>               
            <div className="field col-12">
               <label htmlFor="hours">Плановое количество часов</label>
               <div className={classNames(styles.fieldValue)}>{row.values.hours}</div>
            </div>
         </div>
      </TabPanel>
      <TabPanel header="Контрольные точки">
         <DataView value={row.values.control_points} listTemplate={pointListTemplate}/>
      </TabPanel>
      <TabPanel header="Документы">
      </TabPanel>
   </TabView>         
)

const editCard = (
   <TabView>
      <TabPanel header="Основные данные">         
         <div className="p-fluid formgrid grid">
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
            <div className="field col-12">
               <label htmlFor="hours">Плановое количество часов</label>
               <InputNumber id="hours"  placeholder="Плановое количество часов"
                                    className={classNames({"p-invalid": submitted && !row.values.hours})}
                                    value={row.values.hours}
                                    onValueChange={(e) => row.setFieldValue('hours', e.value)} required autoFocus/>
            </div>
            <Button type="button" label="Зафиксировать окончание работ" className="m-2 mt-0 mb-0" severity="warning"
               onClick={() => acceptItemFact(row.values.id).then(() => {console.log('!!!')})}
            >
               <IconPin stroke={1} />
            </Button>
         </div>
         </TabPanel>
         <TabPanel header="Контрольные точки">
            <Toolbar start={<Button type="button" icon="pi pi-plus" className="mr-2"/>} style={{marginLeft:"0.25rem", marginRight:"0.25rem"}}/>
            <DataView value={row.values.control_points} listTemplate={pointListTemplate}/>
         </TabPanel>
         <TabPanel header="Документы">
            //NOTE - Делаем чипами Chip
         </TabPanel>
   </TabView>
)

const card = (
   <div className={classNames("card p-fluid", styles.card)}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      {recordState === RecordState.ready || row.values.is_closed ? viewCard : editCard }
   </div>
)
//#endregion //!SECTION CARD
//#region //!SECTION CRUD
   const createMethod = async () => {
      setReadOnly(false);
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
      setReadOnly(false);
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
      setReadOnly(true);
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
            crudHelper.crud(controllerName, CRUD.delete, item).then((i) => getRoadmapData(year, division_id));
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
         row.values.roadmap_id = roadmapId;
         setIsLoading(true);
         const res = 
            await crudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, row.values);
   
         setIsLoading(false);
   
         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            await getRoadmapData(year, division_id);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
//#endregion //!SECTION CRUD
//#region //!SECTION CONTROL POINT CRUD
   const saveControlPointMethod = async () => {
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
         row.values.roadmap_id = roadmapId;
         setIsLoading(true);
         const res = 
            await crudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, row.values);

         setIsLoading(false);

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            await getRoadmapData(year, division_id);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
//#endregion

   const addButton = (<Button icon="pi pi-plus" type="button" className="mr-2" onClick={() => createMethod()}/>);
   const refreshButton = (<Button icon="pi pi-refresh" className="mr-2" onClick={() => getRoadmapData(year, division_id)}/>);
   
   return (
      <div className={classNames("col-12", styles.block)}> 
         <div className={classNames("card", styles.roadmap)} style={{position: "relative"}}>
            <Toolbar start={addButton} end={refreshButton} style={{marginTop: "1rem"}}/>
            {
               isLoaded ? <i className="pi pi-spin pi-spinner flex align-items-center justify-content-center mt-4" style={{ fontSize: '10rem', color: '#326fd1'}}/> :
               <div className={classNames(styles.roadmapContainer)} style={{zIndex:"1", position:"relative"}}>
                  {
                     roadmapData?.map((item) => <ItrRoadmapRow 
                        roadmap_id={item.roadmap_id} 
                        project_id={item.project_id} 
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
            <ConfirmDialog />
            <Toast ref={toast} />
         </div>
      </div>
   );
};

export default Roadmap;
