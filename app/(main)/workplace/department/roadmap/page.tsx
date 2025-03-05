'use client'
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import RecordState from "@/models/enums/record-state";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { FormikErrors, useFormik } from "formik";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import CrudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import ItrGrid from "@/components/ItrGrid";
import ItrCard from "@/components/ItrCard";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import styles from './styles.module.scss';
import { useSession } from "next-auth/react";
import { IRoadmap } from "@/models/IRoadmap";
import { TabPanel, TabView } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import { IBaseEntity } from "@/models/IBaseEntity";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { IRoadmapItem } from "@/models/IRoadmapItem";
import ItrControlPoints from "@/components/roadmap/ItrControlPoints";
import { IControlPoint } from "@/models/IControlPoint";
import RolesHelper from "@/services/roles.helper";

const Roadmap = () => {
   const controllerName = 'roadmap';
   const [year, setYear] = useState(new Date().getFullYear());
   const model: IRoadmapItem = {id: undefined, project: undefined, hours: undefined, comment: undefined, is_closed: false, roadmap_id: undefined, fact: 0, plan_str: undefined, fact_str: undefined, control_points: []};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const {data: session} = useSession();
   const [projects, setProjects] = useState<IBaseEntity[]>();
   const [readOnly, setReadOnly] = useState<boolean>(false);

   useEffect(() => {
      changeYear(year);
      setReadOnly(!RolesHelper.checkRoles(session?.user.roles, ['admin','boss','master','analyst']))
   }, []);
   
   const changeYear = (val: number) => {
      setYear(val);
   }

   const readProjects = async () => {
      const res = await fetch(`/api/project/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setProjects(data.data);
   }

//#region //SECTION - GRID
const gridColumns = [
   <Column
      key="roadmapGridColumn1"
      field="project.name"
      header="Проект"
      style={{ width: '42%' }}>
   </Column>,
   <Column
      key="roadmapGridColumn1"
      field="comment"
      header="Примечание"
      style={{ width: '42%' }}>
   </Column>,
   <Column
      key="roadmapGridColumn2"
      field="plan_str"
      header="План"
      style={{ width: '8%' }}>
   </Column>,
   <Column
      key="roadmapGridColumn2"
      field="fact_str"
      header="Факт"
      style={{ width: '8%' }}>
   </Column>
];
//#endregion //!SECTION

//#region //SECTION Card
const roadmap = useFormik<IRoadmapItem>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IRoadmapItem> = {};
      if (!data.project){
         errors.project = "Проект должен быть указан";
      }
      if (!data.hours){
         errors.hours = "Не указано плановое количество часов на реализацию!";
      }
      if (data.hours === 0){
         errors.hours = "Количество часов должно быть больше нуля!";
      }
      return errors;
   },
   onSubmit: () => {
      roadmap.resetForm();
   }
});

const handleItems = (items: IControlPoint[]) => {
   console.clear();
   console.table(items);
   roadmap.setFieldValue('control_points', items);
}

const card = (
   <div className={classNames("card p-fluid", styles.dialogCard)}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <TabView>
         <TabPanel header="Проект">
            <div className="p-fluid formgrid grid">
               <div className="field col-12">
                  <label htmlFor="name">Проект</label>
                  {
                     readOnly ? <h6 className={classNames(styles.hReadOnly)}>{roadmap.values.project?.name}</h6> :
                     <Dropdown
                        value={roadmap.values.project?.id} 
                        className={classNames({"p-invalid": submitted && !roadmap.values.project})} 
                        required 
                        optionLabel="name" 
                        optionValue="id" 
                        filter
                        options={projects}
                        onChange={(e) => {
                           const item = projects?.find(item => item.id === e.value);
                           if (item) {
                              roadmap.setFieldValue('project', item)
                           }
                        }}
                     />
                  }
               </div>
               <div className="field col-12">
                  <label htmlFor="comment">Содержание работ</label>
                  {
                     readOnly ? <h6 className={classNames(styles.hReadOnly)}>{roadmap.values.comment}</h6> :
                     <InputTextarea 
                        id="comment"  placeholder="Содержание"
                        className={classNames({"p-invalid": submitted && !roadmap.values.comment})}
                        value={roadmap.values.comment??''}
                        onChange={(e) => roadmap.setFieldValue('comment', e.target.value)} 
                        autoFocus/>
                  }                  
               </div>               
               <div className="field col-12">
                  <label htmlFor="hours">Плановое количество часов</label>
                  {
                     readOnly ? <h6 className={classNames(styles.hReadOnly)}>{roadmap.values.hours} ч/ч</h6> :
                     <InputNumber id="hours"  placeholder="Плановое количество часов"
                        className={classNames({"p-invalid": submitted && !roadmap.values.hours})}
                        value={roadmap.values.hours}
                        onValueChange={(e) => roadmap.setFieldValue('hours', e.value)}
                        locale="ru-RU" suffix=" ч/ч"
                        required autoFocus/>
                  }                  
               </div>
            </div>
         </TabPanel>         
         <TabPanel header="Контрольные точки">
            <ItrControlPoints
               data={roadmap.values.control_points} 
               readOnly={!RolesHelper.checkRoles(session?.user.roles, ['admin', 'boss', 'master', 'analyst'])}
               itemId={roadmap.values.id}
               onData={handleItems}
            />
         </TabPanel>
         <TabPanel header="Выполненные работы"></TabPanel>
         <TabPanel header="Документы"></TabPanel>
      </TabView>
   </div>
)
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = async() => {
      setCardHeader('Добавление проекта в план работ');
      roadmap.setValues(model);
      await readProjects();
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

const updateMethod = async (data: IRoadmapItem) => {
   setCardHeader(readOnly ? 'Просмотр свойств проекта находящегося в плане' : 'Изменение свойств проекта находящегося в плане');
   roadmap.setValues(data);
   await readProjects();
   setRecordState(RecordState.edit);
   setSubmitted(false);
   if (editor.current) {
      editor.current.visible(true);
   }
}

const deleteMethod = async (data: any) => {
   return await CrudHelper.crud(controllerName, CRUD.delete, { id: data.id });
}

const saveMethod = async () => {
   setSubmitted(true);
   if (!roadmap.isValid) {      
      const errors = Object.values(roadmap.errors);
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
      console.table(roadmap.values.control_points);
      const res = 
         await CrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, roadmap.values, {year: year, division_id: session?.user.division_id});

      setIsLoading(false);

      if (res.status === 'error'){
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
      } else {
         if (editor.current) {
            editor.current.visible(false);
         }
         if (grid.current) {
            grid.current.reload();
         }
      }
   } catch (e: any) {
      toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
      setIsLoading(false);
   }
}
//#endregion

   return (
      session ?
      <div className="grid">
         <div className="col-12">
            <div className={classNames('card', styles.roadmapPage)}>
               <h3>Проекты в работе</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <div className={classNames(styles.beforeGrid)}></div>
               <ItrGrid                  
                  controller={controllerName}
                  params={{year: year, division_id: session.user.division_id}}
                  create={createMethod}
                  update={updateMethod}
                  drop={deleteMethod}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={false}
                  columns={gridColumns}
                  readOnly={readOnly}
                  view={updateMethod}
                  ref={grid}/>
               <ItrCard
                  header={cardHeader}
                  width={'50vw'}
                  save={saveMethod}
                  hiddenSave={readOnly}
                  body={card}
                  ref={editor}
               />
               <ConfirmDialog/>
               <Toast ref={toast} />
            </div>
         </div>
      </div> : <React.Fragment></React.Fragment>
   );
};

export default Roadmap;
