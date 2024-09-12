'use client'
import RecordState from "@/models/enums/record-state";
import { IBaseEntity } from "@/models/IBaseEntity";
import { ICardRef } from "@/models/ICardRef";
import { IGridRef } from "@/models/IGridRef";
import { IStateUnit } from "@/models/IStateUnit";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import React, {useRef, useState, useEffect} from "react";
import { ConfirmDialog } from 'primereact/confirmdialog';
import {confirmDialog} from "primereact/confirmdialog";

const DivisionRate = () => {
   const [data, setData] = useState<IStateUnit[]>([]);
   const [employees, setEmployees] = useState<IBaseEntity[]>([]);
   const {data: session} = useSession();
   const [needSave, setNeedSave] = useState<boolean>(false);

   useEffect(() => {
      getData();
   }, [session]);

   const getData = async () => {
      console.log(session?.user.division_id)
      const res = await fetch(`/api/state_unit/read`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            division_id: session?.user.division_id
         }),
         cache: 'force-cache'
      });
      const data = await res.json();
      setData(data.data);
   }

   const employeeBodyTemplate = (rowData: IStateUnit) => {
      return rowData.employee?.name;
   };

   const onDropdownClick = async (e: any) => {
      const res = await fetch(`/api/state_unit/available?id=${session?.user.division_id}`,
         {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setEmployees(data.data as IBaseEntity[]);
   }

   const employeeEditor = (options: ColumnEditorOptions) => {
      return (
         options.rowData.id < 0 && !needSave ?
         <Dropdown
            value={options.value}
            options={employees}                   
            optionLabel="name" 
            optionValue="id" 
            onMouseDown={(e) => onDropdownClick(e)}
            onChange={(e: DropdownChangeEvent) => {
               const _employee = employees.find((item) => item.id === e.value);
               const _data = data;
               const _item = _data.find((item) => item.id === options.rowData.id);                     
               if (!_item) return;
               if (_employee) {
                  _item.employee = {
                     id: _employee?.id,
                     name: _employee?.name
                  }
               };
               setData(_data);
               setNeedSave(true);
            }}
            placeholder="Вакансия"
            style={{ width: '100%' }}
         /> : options.rowData.employee?.name
      );
   };

   const saveButtonClick = async (e: IStateUnit) => {
      confirmDialog({
         message: (
            <div className="flex flex-column align-items-center w-full gap-3 surface-border mb-2">
               <h6 className="mb-0 mt-0">Вы уверены что хотите привязать сотрудника {e.employee?.name}</h6>
               <h6 className="mb-0 mt-0">к штатной единице {e.post?.name}?</h6>
            </div>
         ),
         header: "Привязка к штатной единице",
         icon: 'pi pi-question text-blue-500',
         acceptLabel: 'Да',
         rejectLabel: 'Нет',
         showHeader: true,
         accept: () => _saveButtonClick(e)
      });
   }

   const _saveButtonClick = async (e: IStateUnit) => {
      await fetch(`/api/state_unit/appoint`, { method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               stuff_unit_id: e.stuff_unit_id,
               employee_id: e.employee?.id,
            })
         });
      await getData();
      setNeedSave(false);
   }

   const cleanButtonClick = async (e: IStateUnit) => {
      confirmDialog({
         message: (
            <div className="flex flex-column align-items-center w-full gap-3 surface-border mb-2">
               <h6 className="mb-0 mt-0">Вы уверены что хотите отвязать сотрудника {e.employee?.name}</h6>
               <h6 className="mb-0 mt-0">от штатной единицы {e.post?.name}?</h6>
            </div>
         ),
         header: 'Освобождение штатной единицы',
         icon: 'pi pi-question text-blue-500',
         acceptLabel: 'Да',
         rejectLabel: 'Нет',
         showHeader: true,
         accept: () => _cleanButtonClick(e)
      });
   }

   const _cleanButtonClick = async (e: IStateUnit) => {      
      const _data = data;
      const _item = _data.find((item) => item.id === e.id);
      if (_item && e.id < 0) {
         _item.employee = undefined;
         setData(_data);
         setNeedSave(false);
         return;
      }
      if (_item && e.id > 0) {         
         await fetch(`/api/state_unit/clean`, { method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: e.id
            })
         });
         await getData();
         setNeedSave(false);
      }
   }

   const saveButtonTemplate = (rowData: IStateUnit) => {
      return (
         rowData.id && rowData.employee && rowData.id < 0 ?
         <Button severity="success" onClick={i => saveButtonClick(rowData)}>
            Привязать
         </Button>
         : <React.Fragment></React.Fragment>
      );
   }   

   const cleanButtonTemplate = (rowData: IStateUnit) => {
      return (
         rowData.employee ?
         <Button severity="danger" onClick={i => cleanButtonClick(rowData)}>
            Освободить
         </Button>
         : <React.Fragment></React.Fragment>
      );
   }   

   return (
      session ?
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Штатные единицы</h3>               
               <DataTable value={data} editMode="cell" dataKey="id" tableStyle={{ minWidth: '100%' }}>
                  <Column field="" header="Сотрудник"  body={employeeBodyTemplate} editor={(options) => employeeEditor(options)} style={{ width: '50%' }}></Column>
                  <Column field="post.name" header="Ставка" style={{ width: '50%' }}></Column>
                  <Column field="" header="" body={saveButtonTemplate} style={{ width: '20rem' }}></Column>
                  <Column field="" header="" body={cleanButtonTemplate} style={{ width: '20rem' }}></Column>
               </DataTable>
               <ConfirmDialog/>
            </div>
         </div>
      </div> : <React.Fragment></React.Fragment>
   );
};

export default DivisionRate;