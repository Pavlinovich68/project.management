'use client'
import ItrCard from "@/components/ItrCard";
import ItrGrid from "@/components/ItrGrid";
import CRUD from "@/models/enums/crud-type";
import RecordState from "@/models/enums/record-state";
import { IBaseEntity } from "@/models/IBaseEntity";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import CrudHelper from "@/services/crud.helper";
import { FormikErrors, useFormik } from "formik";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const Post = () => {
   const controllerName = 'post';
   const model: IBaseEntity = {name: ''};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

//#region //SECTION - GRID
   const gridColumns = [
      <Column
         key="postGridColumn0"
         field="name"
         header="Должность"
         style={{ width: '100%' }}>
      </Column>
   ];
//#endregion //!SECTION
//#region //SECTION Card
   const post = useFormik<IBaseEntity>({
      initialValues: model,
      validate: (data) => {
         let errors: FormikErrors<IBaseEntity> = {};
         if (!data.name){
            errors.name = "Наименование должности должно быть заполнен!";
         }
         return errors;
      },
      onSubmit: () => {
         post.resetForm();
      }
   });

   const card = (
      <div className="card p-fluid">
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
         <div className="p-fluid formgrid grid">
            <div className="field col-12">
               <label htmlFor="name">Наименование должности</label>
               <InputText id="name"  placeholder="Наименование должности"
                                    className={classNames({"p-invalid": submitted && !post.values.name})}
                                    value={post.values.name}
                                    onChange={(e) => post.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
            </div>
         </div>
      </div>
   )
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Создание новой должности');
      post.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = async (data: IBaseEntity) => {
      setCardHeader('Редактирование должности');
      post.setValues(data);
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
      if (!post.isValid) {
         const errors = Object.values(post.errors);
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
            await CrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, post.values);

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
               <h3>Должности</h3>
               <ItrGrid
                  controller={controllerName}
                  create={createMethod}
                  update={updateMethod}
                  drop={deleteMethod}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={false}
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

export default Post;
