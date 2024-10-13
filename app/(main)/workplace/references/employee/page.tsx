'use client'
import ItrCard from "@/components/ItrCard";
import ItrGrid from "@/components/ItrGrid";
import CRUD from "@/models/enums/crud-type";
import RecordState from "@/models/enums/record-state";
import { ICardRef } from "@/models/ICardRef";
import { IEmployee } from "@/models/IEmployee";
import { IGridRef } from "@/models/IGridRef";
import crudHelper from "@/services/crud.helper";
import DateHelper from "@/services/date.helpers";
import { FormikErrors, useFormik } from "formik";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";

const Employees = () => {
   const controllerName = 'employee';
   const model: IEmployee = {id: undefined, name: undefined, email: undefined, begin_date: undefined, end_date: undefined, contacts: undefined};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

//#region //SECTION - GRID
const dateTemplate1 = (rowData: IEmployee) => {
   return DateHelper.formatDate(rowData.begin_date);
};
const dateTemplate2 = (rowData: IEmployee) => {
   return DateHelper.formatDate(rowData.end_date);
};
const gridColumns = [
   <Column
      key="employeeGridColumn0"
      field="name"
      header="Фамилия Имя Отчество"
      sortable
      style={{ width: '45%' }}>
   </Column>,   
   <Column
      key="employeeGridColumn3"
      field="email"
      header="Электронная почта"
      sortable
      style={{ width: '25%' }}>
   </Column>,
   <Column
      key="employeeGridColumn4"
      body={dateTemplate1}
      field="begin_date"
      header="Дата начала"
      sortable
      style={{ width: '15%' }}>
   </Column>,
   <Column
      key="employeeGridColumn5"
      body={dateTemplate2}
      field="end_date"
      header="Дата окончания"
      sortable
      style={{ width: '15%' }}>
   </Column>,
];
//#endregion //!SECTION GRID
//#region //SECTION CARD
const employee = useFormik<IEmployee>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IEmployee> = {};
      if (!data.name){
         errors.name = "ФИО должно быть заполнено!";
      }
      if (!data.email){
         errors.email = "Адрес электронной почты должен быть указан!";
      }
      if (!data.begin_date){
         errors.begin_date = "Дата начала действия должна быть заполнена!";
      }
      return errors;
   },
   onSubmit: () => {
      employee.resetForm();
   }
});

const card = (
   <div className="card p-fluid">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">
         <div className="field col-12">
            <label htmlFor="name">Фамилия Имя Отчество</label>
            <InputText id="name"  placeholder="Фамилия Имя Отчество"
                                 className={classNames({"p-invalid": submitted && !employee.values.name})}
                                 value={employee.values.name}
                                 onChange={(e) => employee.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
         </div>
         <div className="field col-12">
            <label htmlFor="email">Адрес электронной почты</label>
            <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
               </span>
               <InputText id="name"  placeholder="Адрес электронной почты"
                                 className={classNames({"p-invalid": submitted && !employee.values.email})}
                                 value={employee.values.email}
                                 onChange={(e) => employee.setFieldValue('email', e.target.value)} required autoFocus type="email" tooltip="Адрес электронной почты"/>
            </div>
         </div>
         <div className="field col-12">
            <label htmlFor="contacts">Контактная информация</label>
            <div className="p-inputgroup">
               <span className="p-inputgroup-addon">
                  <i className="pi pi-phone"></i>
               </span>
               <InputText id="contacts"  placeholder="Контактная информация"
                                 className={classNames({"p-invalid": submitted && !employee.values.contacts})}
                                 value={employee.values.contacts}
                                 onChange={(e) => employee.setFieldValue('contacts', e.target.value)} required autoFocus type="text" tooltip="Контактная информация"/>
            </div>
         </div>
         <div className="field col-12 md:col-6">
            <label htmlFor="begin_date">Дата начала</label>
            <Calendar id="begin_date" className={classNames({"p-invalid": submitted && !employee.values.begin_date})} value={new Date(employee.values.begin_date as Date)} onChange={(e) => employee.setFieldValue('begin_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата начала"/>
         </div>
         <div className="field col-12 md:col-6">
            <label htmlFor="end_date">Дата окончания</label>
            <Calendar id="end_date" value={employee.values.end_date !== null ? new Date(employee.values.end_date as Date) : null} onChange={(e) => employee.setFieldValue('end_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата окончания"/>
         </div>
      </div>
   </div>
)
//#endregion //!SECTION CARD

//#region //SECTION CRUD
const createMethod = () => {
   setCardHeader('Создание нового сотрудника');
   model.begin_date = new Date();
   employee.setValues(model);
   setRecordState(RecordState.new);
   setSubmitted(false);
   if (editor.current) {
      editor.current.visible(true);
   }
}

const updateMethod = async (data: IEmployee) => {
   setCardHeader('Редактирование сотрудника');
   employee.setValues(data);
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
   if (!employee.isValid) {
      const errors = Object.values(employee.errors);
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
         await crudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, employee.values);

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
//#endregion //!SECTION CRUD

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Сотрудники организации</h3>
               <ItrGrid
                  controller={controllerName}
                  create={createMethod}
                  update={updateMethod}
                  drop={deleteMethod}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={false}
                  columns={gridColumns}
                  sortable
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

export default Employees;
