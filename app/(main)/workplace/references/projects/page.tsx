'use client'
import ItrCard from "@/components/ItrCard";
import CRUD from "@/models/enums/crud-type";
import RecordState from "@/models/enums/record-state";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { IProject } from "@/models/IProject";
import { IProjectNode } from "@/models/IProjectNode";
import CrudHelper from "@/services/crud.helper";
import { FormikErrors, useFormik } from "formik";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { TreeTable } from "primereact/treetable";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const Projects = () => {
   const controllerName = 'project';
   const model: IProject = {code: "", name: "", parent_id: undefined, parent: undefined};
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [nodes, setNodes] = useState<IProjectNode[]>([]);
   const [globalFilter, setGlobalFilter] = useState<string>('');
   const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
   const [deletedProject, setDeletedProject] = useState<IProject>(model);;

   useEffect(() => {
      CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
         setNodes(result.data);
      });
   }, []);

//#region //SECTION Card
const project = useFormik<IProject>({
   initialValues: model,
   validate: (data) => {
      let regEx = undefined;
      if (data.parent_id) {
         regEx = /^[M]\d+/.test(data.code)
      } else {
         regEx = /^[P]\d+/.test(data.code);
      }
      let errors: FormikErrors<IProject> = {};
      if (!regEx){
         errors.code = "Код проекта должен быть заполнен и должен соответствовать заданному шаблону!";
      }
      if (!data.name){
         errors.name = "Наименование проекта должно быть заполнено!";
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
      </div>
   </div>
)
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = (data: IProject | null) => {
      setCardHeader('Создание нового проекта');
      model.parent_id = data?.id;
      project.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = async (data: IProject) => {
      setCardHeader('Редактирование проекта');
      //readDivisions();
      project.setValues(data);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteMethod = async () => {
      if (deletedProject) {
         CrudHelper.crud(controllerName, CRUD.delete, {id: deletedProject.id}).then((result) => {
            CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
               setNodes(result.data);
            });
         });
      }
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
            // if (grid.current) {
            //    grid.current.reload();
            // }
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
//#endregion

   const getHeader = () => {
      return (
         <div className="grid">
            <div className="col-6">
               <div className="flex justify-content-start">
                  <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новый" tooltipOptions={{position: "bottom"}} onClick={() => createMethod(null)}></Button>
               </div>
            </div>
            <div className="col-6">
               <div className="flex justify-content-end">
                  <div className="p-input-icon-left">
                     <i className="pi pi-search"></i>
                     <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Поиск" />
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const actionTemplate = (item: any) => {
      const addVisible = item.data.code.substring(0,1) === 'P';
      console.log(item.data.code, item.data.code.substring(0,1), addVisible);
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" tooltipOptions={{position: "bottom"}} onClick={() => updateMethod(item?.data)}></Button>
            <Button type="button" icon="pi pi-plus" visible={addVisible} severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createMethod(item?.data)}></Button>
            <Button type="button" icon="pi pi-trash" severity="danger" rounded tooltip="Удалить" tooltipOptions={{position: "bottom"}} onClick={() => {setVisibleConfirm(true); setDeletedProject(item?.data)}}></Button>
            <ConfirmPopup
               visible={visibleConfirm}
               onHide={() => setVisibleConfirm(false)}
               message="Вы действительно хотите удалить текущую запись?"
               icon="pi pi-exclamation-triangle"
               acceptLabel="Да"
               rejectLabel="Нет"
               accept={() => deleteMethod()}/>
         </div>
      );
   };

   let header = getHeader();

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Проекты</h3>
               <TreeTable value={nodes} tableStyle={{ minWidth: '50rem' }} globalFilter={globalFilter} showGridlines header={header} filterMode="strict">
                  <Column field="name" header="Наименование проекта" expander></Column>
                  <Column field="code" header="Код" style={{width: "70px"}}></Column>
                  <Column body={actionTemplate} style={{width: "170px"}}/>
               </TreeTable>
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
