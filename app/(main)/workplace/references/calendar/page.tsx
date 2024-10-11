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

const ProductionCalendar = () => {
   const controllerName = 'calendar/production';
   const [year, setYear] = useState(2024);
   const [minDate, setMinDate] = useState<Date>(new Date(2024, 0, 1));
   const [maxDate, setMaxDate] = useState<Date>(new Date(2024, 11, 31));
   const model: IProductionCalendar = {};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      changeYear(year);
   }, []);
   
   const changeYear = (val: number) => {
      setMinDate(new Date(val, 0, 1));
      setMaxDate(new Date(val, 11, 31));
      setYear(val);
   }

//#region //SECTION - GRID
const dateTemplate = (rowData: IProductionCalendar) => {
   return DateHelper.formatDateWithoutYear(rowData.date);   
};

const gridColumns = [
   <Column
      key="calendarGridColumn0"
      sortable
      field="date"
      body={dateTemplate}
      header="Дата исключения"
      style={{ width: '50%' }}>
   </Column>,
   <Column
      key="calendarGridColumn1"
      field="exclusion_type_name"
      sortable
      header="Тип исключения"
      style={{ width: '50%' }}>
   </Column>
];
//#endregion //!SECTION

//#region //SECTION Card
const calendar = useFormik<IProductionCalendar>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IProductionCalendar> = {};
      if (!data.date){
         errors.date = "Месяц должен быть указан!";
      }
      // if (!data.exclusion_type){
      //    errors.exclusion_type = "Тип исключения должен быть указан!";
      // }
      return errors;
   },
   onSubmit: () => {
      calendar.resetForm();
   }
});

const types = [
   { exclusion_type_name: 'Празничный день', exclusion_type: 0 },
   { exclusion_type_name: 'Сокращенный рабочий день', exclusion_type: 1 },
   { exclusion_type_name: 'Перенесенный праздничный день', exclusion_type: 2 },
   { exclusion_type_name: 'Перенесенный рабочий день', exclusion_type: 3 },
];

const card = (
   <div className="card p-fluid">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">
         <div className="field col-12">
            <label htmlFor="month">Дата исключения</label>
            <Calendar 
               value={calendar.values.date ? new Date(calendar.values.date) : null}
               className={classNames({"p-invalid": submitted && !calendar.values.date})} 
               onChange={(e) => calendar.setFieldValue('date', e.target.value)}
               dateFormat="dd MM" 
               locale="ru" 
               showIcon required  showButtonBar
               minDate={minDate} 
               maxDate={maxDate} />
         </div>
         <div className="field col-12">
            <label htmlFor="exclusion_type">Тип исключения</label>
            <Dropdown 
               value={calendar.values.exclusion_type} 
               filter
               onChange={(e) => calendar.setFieldValue('exclusion_type', e.value)}
               optionValue="exclusion_type"
               optionLabel="exclusion_type_name" 
               options={types}                
               placeholder="Выберите пип исключения" 
               className="w-full" />
         </div>
      </div>
   </div>
)
//#endregion //!SECTION

//#region //SECTION CRUD
   const createMethod = () => {
      setCardHeader('Создание нового исключения');
      calendar.setValues(model);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

const updateMethod = async (data: IProductionCalendar) => {
   setCardHeader('Редактирование исключения');
   calendar.setValues(data);
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
         await CrudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, calendar.values);

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
               <h3>Производственный календарь</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
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

export default ProductionCalendar;
