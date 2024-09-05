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
import { Dropdown } from "primereact/dropdown";
import CrudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import ItrGrid from "@/components/ItrGrid";
import ItrCard from "@/components/ItrCard";
import { ConfirmDialog } from "primereact/confirmdialog";
import DateHelper from "@/services/date.helpers";
import { IVacation } from "@/models/IVacation";
import { IBaseEntity } from "@/models/IBaseEntity";
import styles from './styles.module.scss';
import { Calendar } from "primereact/calendar";
import { getSession } from "next-auth/react";

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
   const [divisionId, setDivisionId] = useState<number | undefined>(0);

   useEffect(() => {
      changeYear(year);
      const getDivisionId = async (): Promise<number | undefined> => {
         const _session = await getSession();
         return _session?.user?.division_id;
      }
      getDivisionId().then(
         (n) => {
            readProfiles(n);
            setDivisionId(n);
      });
   }, []);

   const readProfiles = async (divisionId: number | undefined) => {
      
      const res = await fetch(`/api/profile/list?division=${divisionId}&begin_date=${minDate}&end_date=${maxDate}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setProfiles(data.data);
   }
   
   const changeYear = (val: number) => {
      setMinDate(new Date(val-1, 11, 1));
      setMaxDate(new Date(val+1, 0, 31));
      setYear(val);
   }

//#region //SECTION - GRID
const dateTemplate1 = (rowData: IVacation) => {
   return DateHelper.formatDate(rowData.start_date);
};
const dateTemplate2 = (rowData: IVacation) => {
   return DateHelper.formatDate(rowData.end_date);
};

const gridColumns = [
   <Column
      key="calendarGridColumn0"
      field="name"
      header="Сотрудник"
      style={{ width: '50%' }}>
   </Column>,
   <Column
      key="calendarGridColumn1"
      field="start_date"
      body={dateTemplate1}
      header="Дата начала"
      style={{ width: '25%' }}>
   </Column>,
   <Column
      key="calendarGridColumn2"
      field="end_date"
      body={dateTemplate2}
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
                  optionValue="id" 
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
         <div className="field col-6">
            <label htmlFor="start_date">Дата начала</label>
            <Calendar 
               value={vacation.values.start_date ? new Date(vacation.values.start_date) : new Date(year, 0, 1)}
               className={classNames({"p-invalid": submitted && !vacation.values.start_date})} 
               onChange={(e) => vacation.setFieldValue('start_date', e.target.value)}
               dateFormat="dd MM yy"
               locale="ru" 
               showIcon required  showButtonBar
               minDate={minDate} 
               maxDate={maxDate} />
         </div>         
         <div className="field col-6">
            <label htmlFor="end_date">Дата окончания</label>
            <Calendar 
               value={vacation.values.end_date ? new Date(vacation.values.end_date) : new Date(year, 0, 1)}
               className={classNames({"p-invalid": submitted && !vacation.values.end_date})} 
               onChange={(e) => vacation.setFieldValue('end_date', e.target.value)}
               dateFormat="dd MM yy" 
               locale="ru" 
               showIcon required  showButtonBar
               minDate={minDate} 
               maxDate={maxDate} />
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
         await CrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, vacation.values, {year: year});

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
                  params={{year: year, division: divisionId}}
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
      </div>
   );
};

export default Vacations;
