import {DataTable, DataTableSortMeta, DataTableStateEvent} from "primereact/datatable";
import gridTools from "../services/grid.tools";
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState, useRef} from "react";
import {Paginator} from "primereact/paginator";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import {Column} from "primereact/column";
import {confirmDialog} from "primereact/confirmdialog";
import { IGridRef } from "../types/IGridRef";
import {InputSwitch} from "primereact/inputswitch";
import CrudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import {Toast} from "primereact/toast";
import { IDataSourceResult } from "@/types/IDataSourceResult";
import ArrayHelper from "@/services/array.helpers";

const ItrGrid = ({
//SECTION - Parameters
   controller,       //NOTE - Имя контроллера
   data,             //NOTE - Коллекция данных (в случае передачи коллекции имя контроллера можно не указывать)
   create,           //NOTE - Метод создания записи
   update,           //NOTE - Метод редактирования записи
   view,             //NOTE - Метод просмотра записи
   drop,             //NOTE - Метод удаления записи
   columns,          //NOTE - Описание колонок
   tableStyle,       //NOTE - Стили для таблицы
   showClosed,       //NOTE - Показывать закрытые записи
   headerColumnGroup,//NOTE - Для многоуровневого заголовка
   search,           //NOTE - Строка поиска
   readOnly,         //NOTE - Режим "Только для чтения"
   params,           //NOTE - Дополнительные параметры передаваемые в метод выборки
   sortMode,         //NOTE - Режим сортировки
   editReadOnly,     //NOTE - Медод для закрытия кнопки редактирования
   deleteReadOnly,   //NOTE - Метод для закрытия кнопки удаления
   editVisible,      //NOTE - Показывать или нет колонку с кнопкой редактирования
   deleteVisible,    //NOTE - Показывать или нет колонку с кнопкой удаления
   defaultPageSize,  //NOTE - Размер страницы данных (по умолчанию 10)
   headerTemplate,   //NOTE - Можно подать кастомную панель управления
   footer            //NOTE - Метод позволяющий отрисовать подвал
//!SECTION
} : any,
   ref: Ref<IGridRef>) => {
   const toast = useRef<Toast>(null);
   const [first, setFirst] = useState(0);
   const [orderBy, setOrderBy] = useState({});
   const [sort, setSort] = useState<DataTableSortMeta[]>([]);
   const [filter, setFilter] = useState('');
   const [pageSize, setPageSize] = useState(10);
   const [pageNo, setPageNo] = useState(1);
   const [recordCount, setRecordCount] = useState(0);
   const [records, setRecords] = useState<any>([]);
   const [allRecords, setAllRecords] = useState<boolean>(false);
   const [selectedRow, setSelectedRow] = useState(null);
   const [controllerName, setControllerName] = useState(controller);
   const [dataSource, setDataSource] = useState<any[]>(data);
   const [dataSourceResult, setDataSourceResult] = useState<IDataSourceResult>();


   useEffect(() => {
      setDataSource(data);
      setFilter(search);
      fetchData((defaultPageSize??=10), 1, orderBy, search, false).then((data: IDataSourceResult | undefined) => {
            if (!data) return;
            setDataSourceResult(data);
            setPageNo(1);
            setPageSize(data.pageSize);
            setRecordCount(data.recordCount)
            setRecords(data.result);
            gridTools.cleanOrders(`${controller}Grid`);
      });
   }, [search, params]);

   const fetchData = async (pageSize: number, pageNo: number, orderBy: any, searchStr: string, showClosed: boolean) => {
      if (!dataSource) {
         const res = await CrudHelper.crud(controllerName, CRUD.read, {
            pageSize: pageSize,
            pageNo: pageNo,
            orderBy: orderBy,
            searchStr: searchStr,
            showClosed: showClosed
         }, params);
         if (res.status === 'success') {
            return res.data as IDataSourceResult;            
         } else {
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } 
      } else {
         const arr = ArrayHelper.paginate(dataSource, pageSize, pageNo);
         return {
            recordCount: dataSource.length,
            pageNo: pageNo,
            pageSize: pageSize,
            result: arr
         } as IDataSourceResult;
      }
   }

   const onShowAll = (all: boolean) => {
      setAllRecords(all);
      fetchData(pageSize, pageNo, orderBy, filter, all).then((data: IDataSourceResult | undefined)=>{
         if (data){
            setDataSourceResult(data);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   }

   const reload = () => {
      fetchData(pageSize, pageNo, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
               setDataSourceResult(data);
               setRecordCount(data.recordCount)
               setRecords(data.result);
         }
      });
   };

   useImperativeHandle(ref, () => ({reload, records}));

   /* #region  */
   const onSort = (event: DataTableStateEvent) => {
      let sortMeta = event.multiSortMeta ?? [];
      let prevSort = sort;
      if (event.multiSortMeta?.length === 0){
         sortMeta.push({field: event.sortField, order: 1});
         if (prevSort.length !== 0 && prevSort[0].field !== event.sortField) {
            prevSort = [];
         }
      }


      let columnSort = prevSort.find(i => i.field === sortMeta[0].field);

      
      if (!columnSort){
         prevSort.push(sortMeta[0]);
      } else {
         switch (columnSort.order){
            case 1: {
               columnSort.order = -1;
               break;
            }
            case 0: {
               columnSort.order = 1;
               break;
            }
            case -1: {
               const index = prevSort.indexOf(columnSort);
               if (index > -1){
                  prevSort.splice(index, 1);
               }
               break;
            }
         }
      }
      setSort(prevSort);
      let _orderBy: any[] = [];
      prevSort.forEach((item)=>{
         const words = item.field.split('.');
            let str = '{';
            if (item.order !== 0) {
               for (let i = 0; i < words.length; i++){
                  if (i < words.length-1){
                     str = `${str}"${words[i]}": {`
                  } else {
                     str = `${str}"${words[i]}": "${item.order === 1 ? 'asc' : 'desc'}"`
                  }
               }
               for (let i = 0; i < words.length-1; i++){
                  str = `${str}}`
               }
            }
            str += '}';
            _orderBy.push(JSON.parse(str));
      });
      setOrderBy(_orderBy);
      fetchData(pageSize, 1, _orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data){
            setDataSourceResult(data);
            setPageNo(1);
            setPageSize(data.pageSize);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
      //@ts-ignore
      const fields = columns.filter((i) => i.props.sortable).map((i) => i.props.field);
      gridTools.sortOrders(`${controller}Grid`, fields, prevSort);
   }
   /* #endregion */

   const onRefreshCurrentPage = (event: any) => {
      fetchData(pageSize, pageNo, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setDataSourceResult(data);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   };

   const paginatorTemplate = {
      layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
      RowsPerPageDropdown: (options: any) => {
         const dropdownOptions = [
            { label: 5, value: 5 },
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 120, value: 120 }
         ];

         return (
            <React.Fragment>
               <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                  Строк на странице:{' '}
               </span>
               <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
            </React.Fragment>
         );
      },
      CurrentPageReport: (options: any) => {
         return (
            <React.Fragment>
               <Button type="button" icon="pi pi-refresh" text onClick={onRefreshCurrentPage} tooltip="Обновить"  tooltipOptions={{position: "bottom"}}/>
            </React.Fragment>
         );
      }
   };
   const onPageChange = (event: any) => {
      setPageNo(event.page+1);
      setPageSize(event.rows);
      fetchData(event.rows, event.page +1, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setDataSourceResult(data);
            setFirst(event.page * pageSize +1);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   };

   const paginator = <div>
      {footer ? footer(dataSourceResult) : <div></div>}
      <div className="footer-paginator">
         <Paginator template={paginatorTemplate} first={first} rows={pageSize} totalRecords={recordCount} onPageChange={onPageChange} className="justify-content-end" />
      </div>
   </div>;

   const startContent = (
      <React.Fragment>
         <Button icon="pi pi-plus" rounded severity="success" aria-label="Bookmark"
            tooltip="Создать" tooltipOptions={{ position: 'top' }} type="button"
            onClick={() => create()}
         />
      </React.Fragment>
   );

   const onGlobalFilterChange = (e: any) => {
      const value = e.target.value;
      setFilter(value);
      fetchData(pageSize, 1, orderBy, value, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setDataSourceResult(data);
            setPageNo(1);
            setPageSize(data.pageSize);
            setRecordCount(data.recordCount);
            setRecords(data.result);
         }
      });
   };
   const endContent = (
      <React.Fragment>
         {showClosed ? (
            <div className="flex flex-column itr-switch" style={{width: "14rem"}}>
               <label>Показать закрытые записи</label>
               <InputSwitch
                  checked={allRecords}
                  onChange={(e) => onShowAll(e.value ?? false)}
               />
            </div>
         ) : ''}
         {search ? '' :
         <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={filter} onChange={onGlobalFilterChange} placeholder="Поиск" />
         </span>
         }
      </React.Fragment>
   );
   const renderHeader = () => {      
      if (headerTemplate) {
         return headerTemplate;
      } else {
         return (
            <Toolbar start={!readOnly ? startContent : ''} end={endContent} />
         );    
      }
   };
   const header = renderHeader();

   const deleteRecord = async (item: any) => {
      await drop(item);
      fetchData(pageSize, pageNo, orderBy, filter, allRecords).then((data: IDataSourceResult | undefined)=>{
         if (data) {
            setDataSourceResult(data);
            setRecordCount(data.recordCount)
            setRecords(data.result);
         }
      });
   }

   const confirmDelete = (data: any) => {
      confirmDialog({
         message: `Вы уверены что хотите удалить запись?`,
         header: 'Удаление записи',
         icon: 'pi pi-exclamation-triangle text-red-500',
         acceptLabel: 'Да',
         rejectLabel: 'Нет',
         showHeader: true,
         accept: () => deleteRecord(data)
      });
   };

   const editRecordTemplate = (item: any) => {
      const ro = editReadOnly ? editReadOnly(item) : false;
      return <Button icon="pi pi-pencil" className="itr-row-button" rounded severity="info" aria-label="Редактировать"
               tooltip="Редактировать" tooltipOptions={{ position: 'top' }} type="button"
               disabled={ro}
               onClick={() => update(item)}
      />
   }
   const viewRecordTemplate = (item: any) => {
      if (!view) return <></>
      const ro = editReadOnly ? editReadOnly(item) : false;
      return <Button icon="pi pi-eye" className="itr-row-button" rounded severity="info" aria-label="Просмотреть"
               tooltip="Просмотреть" tooltipOptions={{ position: 'top' }} type="button"
               disabled={ro}
               onClick={() => view(item)}
      />
   }
   const deleteRecordTemplate = (item: any) => {      
      const ro = deleteReadOnly ? deleteReadOnly(item) : false;
      return <Button icon="pi pi-trash" severity="danger" className="itr-row-button" rounded aria-label="Удалить"
               tooltip="Удалить" tooltipOptions={{ position: 'top' }} type="button"
               disabled={ro}
               onClick={() => confirmDelete(item)}
      />
   }

   const fillColumns = (ro: boolean) => {
      const result = [];
      if (!ro && (editVisible??=true)) {
         result.push(<Column key={`${controller}GridEditColumn`} header="" body={editRecordTemplate} style={{ width: '1rem' }}/>);
      } else {
         if (view)
            result.push(<Column key={`${controller}GridEditColumn`} header="" body={viewRecordTemplate} style={{ width: '1rem' }}/>);
      }
      for(const item of columns) {
         result.push(item);
      }
      if (!ro && (deleteVisible??=true)) {
         result.push(<Column key={`${controller}GridRemoveColumn`} header="" body={deleteRecordTemplate}  style={{ width: '1rem' }}/>);
      }
      return result;
   }

   return <DataTable
      id={`${controller}Grid`}
      onSort={onSort}
      value={records}
      removableSort
      sortMode={sortMode}
      showGridlines
      stripedRows
      tableStyle={tableStyle}
      footer={paginator}
      header={header}
      headerColumnGroup={headerColumnGroup}
      scrollable 
      scrollHeight='flex'
      selectionMode="single" selection={selectedRow} onSelectionChange={(e) => setSelectedRow(e.value)}
   >
      {fillColumns(readOnly)?.map((item: any) => item)}
   </DataTable>;
}

export default forwardRef(ItrGrid);