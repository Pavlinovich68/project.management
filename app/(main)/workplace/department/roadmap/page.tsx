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

const Roadmap = () => {
   const controllerName = 'roadmap';
   const [year, setYear] = useState(2024);
   const model: IRoadmap = {project: undefined, plan_hours: undefined, comment: undefined};
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
      style={{ width: '80%' }}>
   </Column>,
   <Column
      key="roadmapGridColumn2"
      field="plan_hours"
      header="Плановая трудоемкость"
      style={{ width: '20%' }}>
   </Column>
];
//#endregion //!SECTION

//#region //SECTION Card
const roadmap = useFormik<IRoadmap>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IRoadmap> = {};
      if (!data.project){
         errors.project = "Проект должен быть указан";
      }
      if (!data.plan_hours){
         errors.plan_hours = "Не указано плановое количество часов на реализацию!";
      }
      if (data.plan_hours === 0){
         errors.plan_hours = "Количество часов должно быть больше нуля!";
      }
      return errors;
   },
   onSubmit: () => {
      roadmap.resetForm();
   }
});

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
                  <label htmlFor="name">Наименование работ</label>
                  <InputTextarea value={roadmap.values.comment??''} onChange={(e) => console.log(e.target.value)} rows={2} />
               </div>               
               <div className="field col-12">
                  <label htmlFor="hours">Плановое количество часов</label>
                  <InputNumber value={roadmap.values.plan_hours} onValueChange={(e) => console.log(e.value)} locale="ru-RU" suffix=" человеко/часов"/>
               </div>
            </div>
         </TabPanel> 
         <TabPanel header="Контрольные точки"></TabPanel>
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

const updateMethod = async (data: IRoadmap) => {
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
                  width={'35vw'}
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
