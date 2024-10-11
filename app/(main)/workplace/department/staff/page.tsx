'use client'
import React, {useRef, useState, useEffect} from "react";
import { IStaff, IStaffRate } from "@/models/IStaff";
import { IGridRef } from "@/models/IGridRef";
import { Toast } from "primereact/toast";
import { ICardRef } from "@/models/ICardRef";
import RecordState from "@/models/enums/record-state";
import { Column } from "primereact/column";
import { FormikErrors, useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { IBaseEntity } from "@/models/IBaseEntity";
import crudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import { ConfirmDialog } from "primereact/confirmdialog";
import ItrGrid from "@/components/ItrGrid";
import ItrCard from "@/components/ItrCard";
import { useSession } from "next-auth/react";
import { Calendar } from "primereact/calendar";
import DateHelper from "@/services/date.helpers";
import RolesHelper from "@/services/roles.helper";
import { Button } from "primereact/button";

const Staff = () => {
   const controllerName = 'staff';
   const model: IStaff = {id: undefined, rate: undefined, employee: undefined, begin_date: new Date(), end_date: undefined};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [rates, setRates] = useState<IBaseEntity[]>();
   const [employees, setEmployees] = useState<IBaseEntity[]>();
   const {data: session} = useSession();   
   const [disabledEditors, setDisabledEditors] = useState<boolean>(false);

   const readRates = async () => {
      const res = await fetch(`/api/staff/rate/list?id=${session?.user.division_id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setRates(data.data);
   }

   const readEmployees = async () => {
      const res = await fetch(`/api/staff/employee/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setEmployees(data.data);
   }   

//#region //SECTION - GRID
const dateTemplate1 = (rowData: IStaff) => {
   return DateHelper.formatDate(rowData.begin_date);
};
const dateTemplate2 = (rowData: IStaff) => {
   return DateHelper.formatDate(rowData.end_date);
};

const gridColumns = [      
      <Column
         key="staffGridColumn1"
         field="rate.name"
         header="Ставка"
         style={{ width: '45%' }}>
      </Column>,
      <Column
         key="staffGridColumn2"
         field="employee.name"
         header="Сотрудник"
         style={{ width: '45%' }}>
      </Column>,
      <Column
         key="staffGridColumn3"
         body={dateTemplate1}
         field="begin_date"
         header="Дата начала"
         sortable
         style={{ width: '10%' }}>
      </Column>,
      <Column
         key="staffGridColumn4"
         body={dateTemplate2}
         field="end_date"
         header="Дата окончания"
         sortable
         style={{ width: '10%' }}>
      </Column>      
   ];
//#endregion //!SECTION

//#region //SECTION Card
   const staff = useFormik<IStaff>({
      initialValues: model,
      validate: (data) => {
         let errors: FormikErrors<IStaff> = {};
         if (!data.rate){
            errors.rate = "Ставка должна быть заполнена!";
         }
         if (!data.employee){
            errors.employee = "Сотрудник должен быть указан!";
         }
         return errors;
      },
      onSubmit: () => {
         staff.resetForm();
      }
   });

   const card = (
      <div className="card p-fluid">
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
         <div className="p-fluid formgrid grid">
            <div className="field col-12">
               <label htmlFor="rate" className="mr-3">Ставка</label>
               <div>
                  <Dropdown
                     disabled={disabledEditors}
                     value={staff.values.rate?.id} 
                     className={classNames({"p-invalid": submitted && !staff.values.rate})} 
                     required 
                     optionLabel="name" 
                     optionValue="id" 
                     filter
                     options={rates}
                     onChange={(e) => {
                        const item = rates?.find(item => item.id === e.value);
                        if (item) {
                           staff.setFieldValue('rate', item)
                        }
                     }}
                  />
               </div>
            </div>
            <div className="field col-12">
               <label htmlFor="employee" className="mr-3">Сотрудник</label>
               <div>
                  <Dropdown
                     disabled={disabledEditors}
                     value={staff.values.employee?.id} 
                     className={classNames({"p-invalid": submitted && !staff.values.employee})} 
                     required 
                     optionLabel="name" 
                     optionValue="id" 
                     filter
                     options={employees}
                     onChange={(e) => {
                        const item = employees?.find(item => item.id === e.value);
                        if (item) {
                           staff.setFieldValue('employee', item)
                        }
                     }}
                  />
               </div>
            </div>            
            <div className="field col-12 md:col-6">
               <label htmlFor="begin_date">Дата начала действия</label>
               <Calendar disabled={disabledEditors} id="begin_date" className={classNames({"p-invalid": submitted && !staff.values.begin_date})} value={new Date(staff.values.begin_date)} onChange={(e) => staff.setFieldValue('begin_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата начала действия"/>
            </div>
            <div className="field col-12 md:col-6">
               <label htmlFor="end_date">Дата окончания действия</label>
               <Calendar id="end_date" value={staff.values.end_date !== null ? new Date(staff.values.end_date as Date) : null} onChange={(e) => staff.setFieldValue('end_date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата окончания действия"/>
            </div>
         </div>
      </div>
   )
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Заполнение ставки');
      setDisabledEditors(false);
      readEmployees();
      readRates().then(() => {
         staff.setValues(model);
         setRecordState(RecordState.new);
         setSubmitted(false);
         if (editor.current) {
            editor.current.visible(true);
         }
      });      
   }

   const updateMethod = async (data: IStaff) => {
      setCardHeader('Освобождение ставки');
      setDisabledEditors(true);
      readEmployees()
      readRates().then(()=> {
         staff.setValues(data);
         setRecordState(RecordState.edit);
         setSubmitted(false);
         if (editor.current) {
            editor.current.visible(true);
         }
      });      
   }

   const saveMethod = async () => {
      setSubmitted(true);
      if (!staff.isValid) {
         const errors = Object.values(staff.errors);
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
            await crudHelper.crud(controllerName, CRUD.create, staff.values) :
            await crudHelper.crud(controllerName, CRUD.update, staff.values);

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
               <h3>Штатные единицы</h3>
               <ItrGrid
                  controller={controllerName}
                  create={createMethod}
                  update={updateMethod}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={true}
                  deleteVisible={false}
                  columns={gridColumns}
                  params={{division_id: session.user.division_id}}
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

export default Staff;
