'use client'
import ItrCard from "@/components/ItrCard";
import ItrGrid from "@/components/ItrGrid";
import CRUD from "@/models/enums/crud-type";
import RecordState from "@/models/enums/record-state";
import { IBaseEntity } from "@/models/IBaseEntity";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { IStuffUnit } from "@/models/IStuffUnit";
import CrudHelper from "@/services/crud.helper";
import { FormikErrors, useFormik } from "formik";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import { useSession } from "next-auth/react";

const StuffUnit = () => {
   const controllerName = 'stuff_unit';
   const model: IStuffUnit = {count: 0, division: undefined, post: undefined};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [posts, setPosts] = useState<IBaseEntity[]>([]);
   const [division, setDivision] = useState<IBaseEntity>();
   const {data: session} = useSession();

   const readPosts = async () => {
      const res = await fetch(`/api/post/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setPosts(data.data as IBaseEntity[]);
   }

   const getDivision = async () => {
      const res = await fetch(`/api/division/get?id=${session?.user.division_id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setDivision(data.data as IBaseEntity);
   }

//#region //SECTION - GRID
   const gridColumns = [
      <Column
         key="stuffGridColumn0"
         field="post.name"
         header="Должность"
         style={{ width: '80%' }}>
      </Column>,
      <Column
         key="stuffGridColumn1"
         field="count"
         header="Численность"
         style={{ width: '20%' }}>
      </Column>
   ];
//#endregion //!SECTION

//#region //SECTION Card
   const stuff_unit = useFormik<IStuffUnit>({
      initialValues: model,
      validate: (data) => {
         let errors: FormikErrors<IStuffUnit> = {};
         if (!data.count){
            errors.count = "Количество ставок должно быть указано!";
         }
         if (!data.division){
            errors.division = "Подразделение должно быть указано!";
         }
         if (!data.post){
            errors.post = "Должность должна быть указана!";
         }
         return errors;
      },
      onSubmit: () => {
         stuff_unit.resetForm();
      }
   });

   const card = (
      <div className="card p-fluid">
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
         <div className="p-fluid formgrid grid">
            <div className="field col-12">
               <h6>{division?.name}</h6>               
            </div>
            <div className="field col-12">
               <label htmlFor="post" className="mr-3">Должность</label>
               <div>
                  <Dropdown
                     value={stuff_unit.values.post?.id} 
                     className={classNames({"p-invalid": submitted && !stuff_unit.values.post})} 
                     required 
                     optionLabel="name" 
                     optionValue="id" 
                     filter
                     options={posts}
                     onChange={(e) => {
                        const item = posts?.find(item => item.id === e.value);
                        if (item) {
                           stuff_unit.setFieldValue('post', item)
                        }
                     }}
                  />
               </div>
            </div>
            <div className="field col-3">
               <label htmlFor="code">Численность</label>
               <InputNumber id="count"  placeholder="Численность"
                                    className={classNames({"p-invalid": submitted && !stuff_unit.values.count})}
                                    value={stuff_unit.values.count}
                                    onValueChange={(e) => stuff_unit.setFieldValue('count', e.value)} required autoFocus/>
            </div>            
         </div>
      </div>
   )
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Добавление новой должности');
      getDivision();
      readPosts();
      model.division = division;
      stuff_unit.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateMethod = async (data: IStuffUnit) => {
      setCardHeader('Редактирование должности');
      getDivision();
      readPosts();
      stuff_unit.setValues(data);
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
      const ids: number[] | undefined = grid.current?.records.map(i => i.id);
      if (recordState === RecordState.new && ids && stuff_unit.values.post?.id && ids.includes(stuff_unit.values.post?.id))
      {
         toast.current?.show({
            severity:'warn',
            summary: 'Должность уже заведена',
            content: (
               <div className="flex flex-column">
                  <p>Должность {stuff_unit.values.post.name} уже имеется в списке</p>
                  <small>Измените численность в имеющейся записи</small>
               </div>               
            ),
            life: 5000
         });
         return;
      }
      setSubmitted(true);
      if (!stuff_unit.isValid) {
         const errors = Object.values(stuff_unit.errors);
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
            await CrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, stuff_unit.values);

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
            <div className="card">
               <h3>Ставки</h3>
               <ItrGrid
                  controller={controllerName}
                  params={12}
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
      </div> : <React.Fragment></React.Fragment>
   );
};

export default StuffUnit;
