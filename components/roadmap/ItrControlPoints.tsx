'use client'
import { DataTable } from "primereact/datatable";
import { IControlPoint } from "@/models/IControlPoint";
import { Toolbar } from "primereact/toolbar";
import React, { useState } from "react";
import { Button } from "primereact/button";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import DateHelper from "@/services/date.helpers";

const ItrControlPoints = ({data}: {data: IControlPoint[]}) => {
   
   const startContent = (
         <React.Fragment>
            <Button icon="pi pi-plus" rounded severity="success" aria-label="Bookmark"
               tooltip="Создать" tooltipOptions={{ position: 'top' }} type="button"
               //onClick={() => create()}
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
   
   const typeTemplate = (rowData: IControlPoint) => {
      let name: string | undefined = undefined;
      switch (rowData.type) {
         case 0: { name = "Начало работ"; break; }
         case 1: { name = "Предоставление требований"; break; }
         case 2: { name = "ТЗ подготовлено"; break; }
         case 3: { name = "ТЗ согласовано"; break; }
         case 4: { name = "Предварительные испытания"; break; }
         case 5: { name = "Опытная эксплуатация"; break; }
         case 6: { name = "Приемочные испытани"; break; }
         case 7: { name = "Ввод в эксплуатацию"; break; }
         case 8: { name = "Прочее"; break; }
         case 9: { name = "Завершение работ"; break; }
      }
      return name;
   };

   const header = (
      <Toolbar start={startContent}/> 
   )  
   
   return (
      <DataTable
         value={data}
         header={header}
         showGridlines
         paginator rows={5}
      >
         <Column field="expired_type" dataType="number" body={stateRowTemplate} style={{width: '20px', paddingLeft: '5px', paddingRight: '5px'}} />
         <Column field="name" header="Наименование" key={1}/>
         <Column field="date" body={dateTemplate} header="Дата"  key={2} style={{ width: '90px' }}/>
         <Column field="date" body={typeTemplate} header="Дата"  key={2} style={{ width: '260px' }}/>
      </DataTable>
   );
};

export default ItrControlPoints;
