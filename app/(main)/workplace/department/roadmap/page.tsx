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
import { ConfirmDialog } from "primereact/confirmdialog";
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

const Roadmap = () => {
   const controllerName = 'roadmap';
   const [year, setYear] = useState(new Date().getFullYear());
   const model: IRoadmapItem = {id: undefined, project: undefined, hours: undefined, comment: undefined, is_closed: false, roadmap_id: undefined, fact: 0, plan_str: undefined, fact_str: undefined};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const {data: session} = useSession();
   const [projects, setProjects] = useState<IBaseEntity[]>();

   useEffect(() => {
      changeYear(year);      
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

const _controlPoints: IControlPoint[] = [
   {
      id: 1,
      date: new Date(2025, 0, 10),
      name: "Тестовая контрольная точка 1",
      type: 0,
      roadmap_item_id: 1
   },
   {
      id: 2,
      date: new Date(2025, 1, 10),
      name: "Тестовая контрольная точка 2",
      type: 1,
      roadmap_item_id: 1
   },
   {
      id: 3,
      date: new Date(2025, 2, 10),
      name: "Тестовая контрольная точка 3",
      type: 2,
      roadmap_item_id: 1
   },
   {
      id: 4,
      date: new Date(2025, 3, 10),
      name: "Тестовая контрольная точка 4",
      type: 4,
      roadmap_item_id: 1
   },
   {
      id: 5,
      date: new Date(2025, 4, 10),
      name: "Тестовая контрольная точка 5",
      type: 5,
      roadmap_item_id: 1
   },
   {
      id: 6,
      date: new Date(2025, 5, 10),
      name: "Тестовая контрольная точка 6",
      type: 6,
      roadmap_item_id: 1
   },
   {
      id: 7,
      date: new Date(2025, 6, 10),
      name: "Тестовая контрольная точка 7",
      type: 7,
      roadmap_item_id: 1
   },
   {
      id: 8,
      date: new Date(2025, 7, 10),
      name: "Тестовая контрольная точка 8",
      type: 8,
      roadmap_item_id: 1
   },
   {
      id: 9,
      date: new Date(2025, 8, 10),
      name: "Тестовая контрольная точка 9",
      type: 9,
      roadmap_item_id: 1
   }
]

const card = (
   <div className={classNames("card p-fluid", styles.dialogCard)}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <TabView>
         <TabPanel header="Проект">
            <div className="p-fluid formgrid grid">
               <div className="field col-12">
                  <label htmlFor="name">Проект</label>
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
               </div>
               <div className="field col-12">
                  <label htmlFor="comment">Содержание работ</label>
                  <InputTextarea 
                     id="comment"  placeholder="Содержание"
                     className={classNames({"p-invalid": submitted && !roadmap.values.comment})}
                     value={roadmap.values.comment??''}
                     onChange={(e) => roadmap.setFieldValue('comment', e.target.value)} 
                     autoFocus/>
               </div>               
               <div className="field col-12">
                  <label htmlFor="hours">Плановое количество часов</label>
                  <InputNumber id="hours"  placeholder="Плановое количество часов"
                     className={classNames({"p-invalid": submitted && !roadmap.values.hours})}
                     value={roadmap.values.hours}
                     onValueChange={(e) => roadmap.setFieldValue('hours', e.value)}
                     locale="ru-RU" suffix=" ч/ч"
                     required autoFocus/>
               </div>
            </div>
         </TabPanel>         
         <TabPanel header="Контрольные точки">
            <ItrControlPoints data={_controlPoints}/>
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
   setCardHeader('Изменение проекта находящегося в плане');
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
                  ref={grid}/>
               <ItrCard
                  header={cardHeader}
                  width={'50vw'}
                  save={saveMethod}
                  hiddenSave={false}
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
