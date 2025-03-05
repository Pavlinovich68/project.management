'use client'
import { DataTable } from "primereact/datatable";
import { IControlPoint } from "@/models/IControlPoint";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import DateHelper from "@/services/date.helpers";
import {confirmDialog} from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import styles from '../../app/(main)/workplace/department/dashboard/styles.module.scss';
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
const { v4: uuidv4 } = require('uuid');

type RoadmapCallback = (data: IControlPoint[]) => void;

const ItrControlPoints = ({data, readOnly, itemId, onData}: {data: IControlPoint[], readOnly: boolean, itemId: number | undefined, onData: RoadmapCallback}) => {
   const [cardHeader, setCardHeader] = useState('');
   const [editorVisible, setEditorVisible] = useState<boolean>(false);
   const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
   const [currentRecord, setCurrentRecord] = useState<IControlPoint | undefined>(undefined)
   const [items, setItems] = useState<IControlPoint[]>([]);
   const saveButton = useRef(null);

   useEffect(() => {
      setItems(data);
   }, [itemId]);

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
      if (!rowData.date) {
         rowData.expired_type = 2;
      } else
      if (!rowData.expired_type) {
         let now = new Date();
         now.setHours(0, 0, 0, 0);
         if (now > rowData.date) {
            rowData.expired_type = 2;
         } else {
            let diff = now.getTime() - new Date(rowData.date).getTime();
            diff = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
            if (diff <= 7) {
               rowData.expired_type = 1;
            } else
               rowData.expired_type = 0; 
         }
      }
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
         uuid: uuidv4(),
         id: undefined,
         name: undefined,
         date: undefined,
         type: undefined,
         expired_type: undefined,
         roadmap_item_id: itemId
      })
      setEditorVisible(true);
   }

   const updateMethod = async (data: IControlPoint) => {
      setCardHeader('Изменение контрольной точки');
      setCurrentRecord(data);
      setEditorVisible(true);
   }

   const deleteMethod = async (item: IControlPoint) => {
      const index = items.findIndex(i => i.uuid === item.uuid);
      if (index !== -1) {
         items.splice(index, 1);
         let _items = [...items];
         setItems(_items);
         onData(_items);
      }
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
      if (!record) return;
      let _items = [...items];
      const index = _items.findIndex(i => i.uuid === record?.uuid);
      if (index > -1) {
         _items[index].name = record.name,
         _items[index].type = record.type,
         _items[index].date = record.date,
         _items[index].expired_type = DateHelper.expiredType(record.date);
      } else {         
         record.expired_type = DateHelper.expiredType(record.date);
         _items.push(record);         
      }
      setItems(_items);
      onData(_items)
   }
   
   return (
      <React.Fragment>
         <DataTable
            value={items}
            header={header}
            showGridlines
            paginator rows={5}
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
                           uuid: currentRecord?.uuid,
                           id: currentRecord?.id,
                           name: e.target.value,
                           date: currentRecord?.date,
                           type: currentRecord?.type,
                           expired_type: currentRecord?.expired_type,
                           roadmap_item_id: currentRecord?.roadmap_item_id
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
                              uuid: currentRecord?.uuid,
                              id: currentRecord?.id,
                              name: currentRecord?.name,
                              date: (e.target.value)??undefined,
                              type: currentRecord?.type,
                              expired_type: currentRecord?.expired_type,
                              roadmap_item_id: currentRecord?.roadmap_item_id
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
                              uuid: currentRecord?.uuid,
                              id: currentRecord?.id,
                              name: currentRecord?.name,
                              date: currentRecord?.date,
                              type: e.value,
                              expired_type: currentRecord?.expired_type,
                              roadmap_item_id: currentRecord?.roadmap_item_id
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
