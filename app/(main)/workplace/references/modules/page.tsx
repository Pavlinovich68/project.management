'use client'
import ItrCard from "@/components/ItrCard";
import ItrGrid from "@/components/ItrGrid";
import CRUD from "@/models/enums/crud-type";
import RecordState from "@/models/enums/record-state";
import { IBaseEntity } from "@/models/IBaseEntity";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { IModule } from "@/models/IModule";
import crudHelper from "@/services/crud.helper";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { TreeNode } from "primereact/treenode";
import { TreeTable } from "primereact/treetable";
import React, {useRef, useState, useEffect} from "react";

const Modules = () => {
   const controllerName = 'module';
   const model: IModule = {code: "", name: "", division: undefined, project: undefined};
   const [projects, setProjects] = useState([]);
   const [globalFilter, setGlobalFilter] = useState<string>('');
   const [visibleConfirm, setVisibleConfirm] = useState(false);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   //#region //SECTION - TREE   
   const header = (
      <div className="grid">
            <div className="col-6">
               <div className="flex justify-content-start">
                  <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createProject(null)}/>
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
   //#endregion //!SECTION

   //#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Создание нового модуля');
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = async (data: IModule) => {
   setCardHeader('Редактирование модуля');
   setRecordState(RecordState.edit);
   setSubmitted(false);
   if (editor.current) {
      editor.current.visible(true);
   }
   }

   const deleteMethod = async (data: any) => {
      return await crudHelper.crud(controllerName, CRUD.delete, { id: data.id });
   }

   const saveMethod = async () => {
      setSubmitted(true);
      if (!calendar.isValid) {
         const errors = Object.values(calendar.errors);
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
            await СrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, calendar.values);

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

   const actionTemplate = (
      <div className="flex flex-wrap gap-2">
         <Button type="button" icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" tooltipOptions={{position: "bottom"}} onClick={() => updateMethod(item?.data)}/>
         <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новый" tooltipOptions={{position: "bottom"}} onClick={() => createMethod(item?.data)}/>
         <Button type="button" icon="pi pi-trash" severity="danger" rounded tooltip="Удалить" tooltipOptions={{position: "bottom"}} onClick={() => {setVisibleConfirm(true); setDeletedDivision(item?.data)}}/>
      </div>
   );

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Модули проектов</h3>
               <TreeTable value={projects} expandedKeys={{'0-1': true}}  tableStyle={{ minWidth: '50rem' }} globalFilter={globalFilter} resizableColumns showGridlines header={header} filterMode="strict">
                  <Column field="name" header="Наименование структурного подразделения" expander style={{width: '60%'}}></Column>
                  <Column field="short_name" header="Короткое наименование" style={{width: '15rem'}}></Column>
                  <Column field="contacts" header="Контактная информация"></Column>
                  <Column body={actionTemplate} style={{width: "165px"}} />
               </TreeTable>
               {/* <ItrCard
                  header={cardHeader}
                  width={'35vw'}
                  save={saveMethod}
                  hiddenSave={false}
                  body={card}
                  ref={editor}
               /> */}
               <ConfirmDialog/>
               <Toast ref={toast} />
            </div>
         </div>
      </div>
   );
};

export default Modules;
