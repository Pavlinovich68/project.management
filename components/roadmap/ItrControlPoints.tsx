'use client'
import { DataTable } from "primereact/datatable";
import { IControlPoint } from "@/models/IControlPoint";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import DateHelper from "@/services/date.helpers";
import { ICardRef } from "@/models/ICardRef";
import {confirmDialog} from "primereact/confirmdialog";
import RecordState from "@/models/enums/record-state";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import styles from '../../app/(main)/workplace/department/dashboard/styles.module.scss';
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { IRoadmapItem } from "@/models/IRoadmapItem";
import { FormikConfig } from "formik";
import { FilterMatchMode } from 'primereact/api';

const ItrControlPoints = ({data, readOnly, itemId}: {data: IControlPoint[], readOnly: boolean, itemId: number | undefined}) => {
   const [cardHeader, setCardHeader] = useState('');
   const [editorVisible, setEditorVisible] = useState<boolean>(false);
   const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
   const [currentRecord, setCurrentRecord] = useState<IControlPoint | undefined>(undefined)
   const saveButton = useRef(null);

   const types = [
      { type: 0, name: "Начало работ"},
      { type: 1, name: "Предоставление требований"},
      { type: 2, name: "ТЗ подготовлено"},
      { type: 3, name: "ТЗ согласовано"},
      { type: 4, name: "Предварительные испытания"},
      { type: 5, name: "Опытная эксплуатация"},
      { type: 6, name: "Приемочные испытани"},
      { type: 7, name: "Ввод в эксплуатацию"},
      { type: 8, name: "Прочее"},
      { type: 9, name: "Завершение работ"}
   ]

   const startContent = (
         <React.Fragment>
            <Button icon="pi pi-plus" rounded severity="success" aria-label="Bookmark"
               tooltip="Создать" tooltipOptions={{ position: 'top' }} type="button"
               onClick={() => createMethod()}
            />
         </React.Fragment>
      );

   const dateTemplate = (rowData: IControlPoint) => {
         return DateHelper.formatDate(rowData.date);
   };

   const stateRowTemplate = (rowData: IControlPoint) => {
      let color: string | undefined;
      switch (rowData.expired_type) {
         case 0: { color = 'green'; break; }
         case 1: { color = 'yellow'; break; }
         case 2: { color = 'red'; break; }
      }
      return (<i className="pi pi-star-fill" style={{ color: color }}></i>);
   };
   
   const typeTemplate = (rowData: IControlPoint): string | undefined => {
      let item = types.find(i => i.type === rowData.type);
      return item?.name;
   };

   const header = (
      readOnly ? undefined : <Toolbar start={startContent}/>
   )

   const createMethod = async() => {
      setCardHeader('Добавление контрольной точки');
      setCurrentRecord({
         id: undefined,
         name: undefined,
         date: undefined,
         type: undefined,
         expired_type: undefined,
         roadmap_item_id: itemId,
         is_deleted: false
      })
      setEditorVisible(true);
   }

   const updateMethod = async (data: IControlPoint) => {
      setCardHeader('Изменение контрольной точки');
      setCurrentRecord(data);
      setEditorVisible(true);
   }

   const deleteMethod = async (item: IControlPoint) => {
      item.is_deleted = true;
   }

   const confirmDelete = (data: IControlPoint) => {
      confirmDialog({
         message: `Вы уверены что хотите удалить запись?`,
         header: 'Удаление записи',
         icon: 'pi pi-exclamation-triangle text-red-500',
         acceptLabel: 'Да',
         rejectLabel: 'Нет',
         showHeader: true,
         accept: () => deleteMethod(data)
      });
   };

   const editRecordTemplate = (item: IControlPoint) => {
      return <Button icon="pi pi-pencil" className="itr-row-button" rounded severity="info" aria-label="Редактировать"
               tooltip="Редактировать" tooltipOptions={{ position: 'top' }} type="button"
               onClick={() => updateMethod(item)}
      />
   }

   const deleteRecordTemplate = (item: any) => {      
      return <Button icon="pi pi-trash" severity="danger" className="itr-row-button" rounded aria-label="Удалить"
               tooltip="Удалить" tooltipOptions={{ position: 'top' }} type="button"
               onClick={() => confirmDelete(item)}
      />
   }

   const accept = () => {
      refreshRecord(currentRecord)
      setEditorVisible(false);
   }

   const dialogFooter = (
         <div className="itr-dialog-footer">
            <Button label="Отмена" icon="pi pi-times" className="p-button-text" onClick={() => setEditorVisible(false)}/>
            <Button label="Сохранить" icon="pi pi-check" autoFocus onClick={() => setVisibleConfirm(true)} ref={saveButton}/>
            <ConfirmPopup
               visible={visibleConfirm}
               onHide={() => setVisibleConfirm(false)}
               message="Вы действительно хотите сохранить изменения?"
               icon="pi pi-exclamation-triangle"
               //@ts-ignore
               target={saveButton.current}
               acceptLabel="Да"
               rejectLabel="Нет"
               accept={accept}
         />
         </div>
      );

   const refreshRecord = (record: IControlPoint | undefined) => {
      if (record && record?.id == undefined) {
         let _record: IControlPoint = {
            id: record.id,
            name: record.name,
            date: record.date,
            type: record.type,
            expired_type: record.expired_type,//DateHelper.expiredType(record.date),
            roadmap_item_id: itemId,
            is_deleted: false
         }
         data.push(_record);
         return;
      }
      if (record) {
         let _record = data.find(i => i.id === record.id);
         if (_record) {
            _record.name = record.name;
            _record.type = record.type;
            _record.date = record.date;
            _record.expired_type = record.expired_type//DateHelper.expiredType(record.date);
         }
      }
   }
   
   return (
      <React.Fragment>
         <DataTable
            value={data}
            header={header}
            showGridlines
            paginator rows={5}
            filters={{f_deleted: {value: true, matchMode: FilterMatchMode.EQUALS}}}
         >
            {
               readOnly ? undefined : <Column key={`controlPointGridEditColumn`} header="" body={editRecordTemplate} style={{ width: '1rem' }}/>
            }
            <Column field="expired_type" dataType="number" body={stateRowTemplate} style={{width: '20px', paddingLeft: '5px', paddingRight: '5px'}} />
            <Column field="date" body={typeTemplate} header="Тип КТ"  key={3} style={{ width: '260px' }}/>
            <Column field="date" body={dateTemplate} header="Дата"  key={2} style={{ width: '90px' }}/>            
            <Column field="name" header="Комментарий" key={1}/>
            {
               readOnly ? undefined : <Column key={`controlPointGridRemoveColumn`} header="" body={deleteRecordTemplate}  style={{ width: '1rem' }}/>
            }
            <Column field="is_deleted" hidden={true} filter={true}/>
         </DataTable>
         <Dialog
            className="itr-dialog"
            header={cardHeader}
            visible={editorVisible}
            style={{width: '600px'}}
            footer={dialogFooter}
            onHide={()=> setEditorVisible(false)}
         >
            <div className={classNames("card p-fluid", styles.dialogCard)}>
               <div className="p-fluid formgrid grid">
                  <div className="field col-12">
                     <label htmlFor="name">Наименование</label>
                     <InputText value={currentRecord?.name} onChange={(e) => {
                        let _record: IControlPoint = {
                           id: currentRecord?.id,
                           name: e.target.value,
                           date: currentRecord?.date,
                           type: currentRecord?.type,
                           expired_type: currentRecord?.expired_type,
                           roadmap_item_id: currentRecord?.roadmap_item_id,
                           is_deleted: false
                        };
                        setCurrentRecord(_record);
                     }} />
                  </div>
                  <div className="field col-12">
                     <label htmlFor="name">Дата</label>
                     <Calendar 
                        id="date" 
                        value={new Date(currentRecord?.date as Date)} 
                        onChange={(e) => {
                           let _record: IControlPoint = {
                              id: currentRecord?.id,
                              name: currentRecord?.name,
                              date: (e.target.value)??undefined,
                              type: currentRecord?.type,
                              expired_type: currentRecord?.expired_type,
                              roadmap_item_id: currentRecord?.roadmap_item_id,
                              is_deleted: false
                           };
                           setCurrentRecord(_record);
                        }} 
                        dateFormat="dd MM yy" 
                        locale="ru" showIcon required  showButtonBar tooltip="Дата"
                     />
                  </div>
                  <div className="field col-12">
                     <label htmlFor="name">Тип</label>
                     <Dropdown
                        value={currentRecord?.type}
                        required 
                        optionLabel="name" 
                        optionValue="type" 
                        filter
                        options={types}
                        onChange={(e) => {
                           let _record: IControlPoint = {
                              id: currentRecord?.id,
                              name: currentRecord?.name,
                              date: currentRecord?.date,
                              type: e.value,
                              expired_type: currentRecord?.expired_type,
                              roadmap_item_id: currentRecord?.roadmap_item_id,
                              is_deleted: false
                           };
                           setCurrentRecord(_record);
                        }}
                     />
                  </div>
               </div>
            </div>            
         </Dialog>
      </React.Fragment>
   );
};

export default ItrControlPoints;
