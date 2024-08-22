'use client'
import React, {useRef, useState, useEffect, forwardRef, Ref, useImperativeHandle} from "react";
import ItrGrid from "./ItrGrid";
import ItrCard from "./ItrCard";
import { IGridRef } from "@/models/IGridRef";
import { IAgreement } from "@/models/IAgreement";
import { Column } from "primereact/column";
import DateHelper from "@/services/date.helpers";
import { ICardRef } from "@/models/ICardRef";
import { FormikErrors, useFormik } from "formik";
import RecordState from "@/models/enums/record-state";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import styles from './styles.module.scss';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import GuidHelper from "@/services/guid.helper";

const Agreements = ({readOnly, data} : {readOnly: boolean, data: IAgreement[] | undefined}) => {
   const emptyAgreement: IAgreement = {id: undefined, type: 0, no: undefined, date: new Date(), content: undefined};
   const grid = useRef<IGridRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const editor = useRef<ICardRef>(null);
   const [submitted, setSubmitted] = useState(false);
   
   const createAgreement = async () => {
      setCardHeader('Создание нового дополнительного соглашения');
      agreement.setValues(emptyAgreement);
      setRecordState(RecordState.new);
      if (editor.current) {
         editor.current.visible(true);
      }
   };

   const updateAgreement = async (item: IAgreement) => {
      setCardHeader('Редактирование дополнительного соглашения');
      agreement.setValues(item);
      setRecordState(RecordState.edit);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteAgreement = async (item: IAgreement) => {
      const _index = data?.indexOf(item);
      if (_index === undefined) return;
      if (_index > -1) {
         data?.splice(_index, 1);
         if (grid.current) {
            grid.current.reload();
         }
      }
   }

   const saveAgreement = async () => {
      const item = agreement.values;
      console.log(item);
      if (recordState === RecordState.new) {
         data?.push(item);
      } else {
         const editedItem = data?.find((i) => i.id === item.id);
         if (editedItem) {
            editedItem.date = item.date;
            editedItem.no = item.no;
            editedItem.content = item.content;
            editedItem.type = item.type;
         }
      }

      if (editor.current) {
         editor.current.visible(false);
      }
      if (grid.current) {
         grid.current.reload();
      }
   }

   const dateTemplate = (rowData: IAgreement) => {
      return DateHelper.formatDate(rowData.date);
   };

   const gridColumns = [
      <Column
         key="agreementColumn1"
         sortable
         header="Дата"
         body={dateTemplate}
         style={{width: "20%"}}>
      </Column>,
      <Column
         key="agreementColumn2"
         field="no"
         sortable
         header="№"
         style={{width: "10%"}}>
      </Column>,
      <Column
         key="agreementColumn3"
         field="content"
         sortable
         header="Содержание"
         style={{width: "70%"}}>
      </Column>
   ];

//#region //ANCHOR - Formik
const agreement = useFormik<IAgreement>({
   initialValues: emptyAgreement,
   validate: (data) => {
      let errors: FormikErrors<IAgreement> = {};
      if (!data.date){
         errors.date = "Необходимо указать дату дополнительного соглашения!";
      }
      if (!data.no){
         errors.no = "Необходимо указать номер дополнительного соглашения!";
      }
      if (!data.content){
         errors.content = "Необходимо указать суть дополнительного соглашения!";
      }
      return errors;
   },
   onSubmit: () => {
      agreement.resetForm();
   }
});
const editReadOnly = (item: IAgreement) => {
   return item.id === undefined;
}

//#endregion
const operationType = [
   { label: 'Изменение', value: 0 },
   { label: 'Расторжение', value: 1 }
];
   const card = (
      <div className="card p-fluid">
         <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
               <label htmlFor="agreement-date">Дата соглашения</label>
               <Calendar id="agreement-date" className={classNames({"p-invalid": submitted && !agreement.values.date})} value={agreement.values.date ? new Date(agreement.values.date) : undefined} onChange={(e) => agreement.setFieldValue('date', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата соглашения"/>
            </div>
            <div className="field col-12 md:col-6">
               <label htmlFor="agreement-no">Номер соглашения</label>
               <InputText id="agreement-no"
                  className={classNames(styles.textRight)}
                        value={agreement.values.no}
                        onChange={(e) => agreement.setFieldValue('no', e.target.value)} required type="text"/>
            </div>
            <div className="field col-12">
               <label htmlFor="agreement-content">Суть</label>
               <InputTextarea id="agreement-content"
                  className={classNames(styles.textRight)}
                        value={agreement.values.content}
                        onChange={(e) => agreement.setFieldValue('content', e.target.value)} rows={3} required/>
            </div>
            <div className={classNames("field col-12")}>
               <label htmlFor="type">Тип соглашения</label>
               <Dropdown 
                  placeholder="Тип соглашения"
                  value={agreement.values.type} 
                  className={classNames({"p-invalid": submitted && !agreement.values.type})} 
                  required 
                  filter
                  optionLabel="label" 
                  optionValue="value" 
                  options={operationType}
                  onChange={(e) => {
                     agreement.setFieldValue('type', e.value)
                  }}
               />
            </div>                                          
         </div>
      </div>
   )
   return (
      <div className={classNames("grid", readOnly ? "form-disabled" : "")}>
         <div className="col-12">
            <ItrGrid
               data={data}
               create={createAgreement}
               update={updateAgreement}
               drop={deleteAgreement}
               tableStyle={{ minWidth: '30rem' }}
               showClosed={false}
               columns={gridColumns}
               sortMode="multiple"
               search='false'
               editReadOnly={editReadOnly}
               ref={grid}/>
            <ItrCard
               header={cardHeader}
               width={'35vw'}
               save={saveAgreement}
               body={card}
               hiddenSave={false}
               ref={editor}
            />
         </div>
      </div>
   );
};

export default Agreements;
