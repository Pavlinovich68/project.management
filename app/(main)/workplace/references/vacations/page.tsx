'use client'
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import RecordState from "@/models/enums/record-state";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { IProductionCalendar } from "@/models/IProductionCalendar";
import { FormikErrors, useFormik } from "formik";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
import { Dropdown } from "primereact/dropdown";
import CrudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import ItrGrid from "@/components/ItrGrid";
import ItrCard from "@/components/ItrCard";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Calendar } from "primereact/calendar";
import DateHelper from "@/services/date.helpers";
import { IVacation } from "@/models/IVacation";
import { IBaseEntity } from "@/models/IBaseEntity";
import styles from './styles.module.scss';

const Vacations = () => {
   const controllerName = 'vacation';
   const [year, setYear] = useState(2024);
   const [minDate, setMinDate] = useState<Date>(new Date(2024, 0, 1));
   const [maxDate, setMaxDate] = useState<Date>(new Date(2024, 11, 31));
   const model: IVacation = {};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [profiles, setProfiles] = useState<IBaseEntity[]>();
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      changeYear(year);
   }, []);
   
   const changeYear = (val: number) => {
      setMinDate(new Date(val, 0, 1));
      setMaxDate(new Date(val, 11, 31));
   }

//#region //SECTION - GRID
const dateTemplate = (rowData: IProductionCalendar) => {
   return DateHelper.formatDate(rowData.date);
};

const gridColumns = [
   <Column
      key="calendarGridColumn0"
      field="name"
      sortable
      header="Сотрудник"
      style={{ width: '50%' }}>
   </Column>,
   <Column
      key="calendarGridColumn1"
      sortable
      field="start_date"
      body={dateTemplate}
      header="Дата начала"
      style={{ width: '25%' }}>
   </Column>,
   <Column
      key="calendarGridColumn2"
      sortable
      field="end_date"
      body={dateTemplate}
      header="Дата окончания"
      style={{ width: '25%' }}>
   </Column>
];
//#endregion //!SECTION

//#region //SECTION Card
const vacation = useFormik<IVacation>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IVacation> = {};
      if (!data.profile_id){
         errors.profile_id = "Сотрудник быть указан!";
      }
      if (!data.start_date){
         errors.start_date = "Дата начала должна быть указан!";
      }
      if (!data.end_date){
         errors.end_date = "Дата окончания должна быть указан!";
      }
      return errors;
   },
   onSubmit: () => {
      vacation.resetForm();
   }
});

const card = (
   <div className="card p-fluid">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">
      <div className="field col-12">
         <label htmlFor="is_priority" className="mr-3">Сотрудник</label>
            <div>
               <Dropdown 
                  value={vacation.values.profile_id} 
                  className={classNames({"p-invalid": submitted && !vacation.values.profile_id})} 
                  required 
                  optionLabel="name" 
                  optionValue="project_id" 
                  options={profiles}
                  onChange={(e) => {
                     const item = profiles?.find(item => item.id === e.value);
                     if (item) {
                        vacation.setFieldValue('profile_id', item.id);
                     }
                  }}
               />
            </div>
         </div>
         <div className="field col-12">
            <label htmlFor="month">Планируемый отпуск</label>
            {/* <Calendar 
               value={calendar.values.date ? new Date(calendar.values.date) : null}
               className={classNames({"p-invalid": submitted && !calendar.values.date})} 
               onChange={(e) => calendar.setFieldValue('date', e.target.value)}
               dateFormat="dd MM yy" 
               locale="ru" 
               showIcon required  showButtonBar
               minDate={minDate} 
               maxDate={maxDate} /> */}
         </div>         
      </div>
   </div>
)
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Планирование отпуска');
      vacation.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

const updateMethod = async (data: IVacation) => {
   setCardHeader('Изменение запланированного отпуска');
   vacation.setValues(data);
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
   if (!vacation.isValid) {
      const errors = Object.values(vacation.errors);
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
         await CrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, vacation.values);

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
            <div className={classNames('card', styles.vacationsPage)}>
               <h3>График отпусков</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <div className={classNames(styles.beforeGrid)}></div>
               <ItrGrid                  
                  controller={controllerName}
                  params={{year: year}}
                  create={createMethod}
                  update={updateMethod}
                  drop={deleteMethod}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={false}
                  columns={gridColumns}
                  sortMode="multiple"
                  search={true}
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

export default Vacations;
