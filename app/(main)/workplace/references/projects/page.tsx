'use client'
import ItrCard from "@/components/ItrCard";
import ItrGrid from "@/components/ItrGrid";
import CRUD from "@/models/enums/crud-type";
import RecordState from "@/models/enums/record-state";
import { IBaseEntity } from "@/models/IBaseEntity";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { IProject } from "@/models/IProject";
import CrudHelper from "@/services/crud.helper";
import { FormikErrors, useFormik } from "formik";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const Projects = () => {
   const controllerName = 'project';
   const model: IProject = {code: "", name: "", division: undefined, begin_date: undefined};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [divisions, setDivisions] = useState<IBaseEntity>();

   const readDivisions = async () => {
      const res = await fetch(`/api/division/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setDivisions(data.data);
   }

//#region //SECTION - GRID
   const gridColumns = [
      <Column
         key="projectGridColumn0"
         field="division.name"
         sortable
         header="Ответственное подразделение"
         style={{ width: '40%' }}>
      </Column>,
      <Column
         key="projectGridColumn1"
         field="code"
         sortable
         header="Код"
         style={{ width: '10%' }}>
      </Column>,
      <Column
         key="projectGridColumn2"
         field="name"
         sortable
         header="Наименование проекта"
         style={{ width: '50%' }}>
      </Column>
   ];
//#endregion //!SECTION

//#region //SECTION Card
const project = useFormik<IProject>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IProject> = {};
      if (!data.code){
         errors.code = "Код проекта должен быть заполнен!";
      }
      if (!data.name){
         errors.name = "Наименование проекта должно быть заполнено!";
      }
      if (!data.division){
         errors.division = "Ответственное подразделение должно быть заполнено!";
      }
      if (!data.begin_date){
         errors.begin_date = "Дата начала действия должна быть заполнена!";
      }
      return errors;
   },
   onSubmit: () => {
      project.resetForm();
   }
});

const card = (
   <div className="card p-fluid">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">
         <div className="field col-12">
            <label htmlFor="is_priority" className="mr-3">Ответственное подразделение</label>
            <div>
               <Dropdown 
                  value={project.values.division?.id} 
                  className={classNames({"p-invalid": submitted && !project.values.division})} 
                  required 
                  optionLabel="name" 
                  optionValue="id" 
                  filter
                  //@ts-ignore
                  options={divisions}
                  onChange={(e) => {
                     //@ts-ignore
                     const item = divisions?.find(item => item.id === e.value);
                     if (item) {
                        project.setFieldValue('division', item)
                     }
                  }}
               />
            </div>
         </div>
         <div className="field col-12">
            <label htmlFor="code">Код проекта</label>
            <InputText id="code"  placeholder="Код проекта"
                                 className={classNames({"p-invalid": submitted && !project.values.code})}
                                 value={project.values.code}
                                 onChange={(e) => project.setFieldValue('code', e.target.value)} required autoFocus type="text"/>
         </div>
         <div className="field col-12">
            <label htmlFor="name">Наименование проекта</label>
            <InputText id="name"  placeholder="Наименование проекта"
                                 className={classNames({"p-invalid": submitted && !project.values.name})}
                                 value={project.values.name}
                                 onChange={(e) => project.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
         </div>
         <div className="field col-12 md:col-6">
            <label htmlFor="begin_date">Дата старта проекта</label>
            <Calendar id="begin_date" className={classNames({"p-invalid": submitted && !project.values.begin_date})} value={new Date(project.values.begin_date as Date)} onChange={(e) => project.setFieldValue('begin_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата старта"/>
         </div>
         <div className="field col-12 md:col-6">
            <label htmlFor="end_date">Дата закрытия проекта</label>
            <Calendar id="end_date" value={project.values.end_date !== null ? new Date(project.values.end_date as Date) : null} onChange={(e) => project.setFieldValue('end_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата закрытия проекта"/>
         </div>
      </div>
   </div>
)
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Создание нового проекта');
      readDivisions();
      project.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = async (data: IProject) => {
      setCardHeader('Редактирование проекта');
      readDivisions();
      project.setValues(data);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteMethod = async (data: any) => {
      debugger;
      return await CrudHelper.crud(controllerName, CRUD.delete, { id: data.id });
   }

   const saveMethod = async () => {
      setSubmitted(true);
      if (!project.isValid) {
         const errors = Object.values(project.errors);
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
         const res = recordState === RecordState.new ?
            await CrudHelper.crud(controllerName, CRUD.create, project.values) :
            await CrudHelper.crud(controllerName, CRUD.update, project.values);

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
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Проекты</h3>
               <ItrGrid
                  controller={controllerName}
                  create={createMethod}
                  update={updateMethod}
                  drop={deleteMethod}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={true}
                  columns={gridColumns}
                  sortMode="multiple"
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
      </div>
   );
};

export default Projects;
