'use client'
import React, {useRef, useState, useEffect} from "react";
import { DataScroller } from 'primereact/datascroller';
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { IAttachment } from "@/models/IAttachment";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import styles from './styles.module.scss';
import DateHelper from "@/services/date.helpers";
import CRUD from "@/models/enums/crud-type";
import attachmentService from "@/services/attachment.service";
import { Toast } from "primereact/toast";

const ItrFileList = ({bucketName}:{bucketName: string}) => {
   const [items, setItems] = useState<IAttachment[]>([]);
   const toast = useRef<Toast>(null);

   useEffect(() => {
      readFiles();
   }, [bucketName]);

   const handleDownload = async (fileName: string) => {
      try {
         const response = await fetch('/api/attachment/download', {
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               objectName: bucketName,
               fileName: fileName
            })
         });

         if (!response.ok) {
            throw new Error('Ошибка при скачивании файла');
         }

         const blob = await response.blob();

         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', fileName);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
      } catch (error: any) {
         toast.current?.show({ severity: "error", summary: "Скачивание документа", detail: error.stack, sticky: true });
      }
   };

   const drop = async (id: number | undefined) => {
      if (!id) return;
      try {
         const response = await fetch('/api/attachment/drop', {
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: id
            })
         });
         if (!response.ok) {
            throw new Error('Ошибка удаления файла');
         }
         
         const _items:IAttachment[] = [];
         for (const item of items) {
            if (item.id !== id)
               _items.push(item);
         }
         setItems(_items);
      } catch (error: any) {
         toast.current?.show({ severity: "error", summary: "Удаление документа", detail: error.stack, sticky: true });
      }
   };

   const itemTemplate = (data: IAttachment) => {
      return (
         <div className={classNames(styles.rowContainer)}>
            <div className={classNames("flex align-items-center justify-content-center flex-wrap")}>
               <Button icon="pi pi-download" tooltip="Скачать документ" tooltipOptions={{ position: 'top' }} type="button" rounded severity="info" onClick={() => handleDownload(data.filename)}/>
            </div>               
            <div className={classNames("flex align-items-center justify-content-start flex-wrap")}>{data.filename}</div>
            <div className={classNames("flex align-items-center justify-content-center flex-wrap")}>
               <small>Дата загрузки</small>
               <div>{DateHelper.formatDate(data.date)}</div>
            </div>
            <div className={classNames("flex align-items-center justify-content-center flex-wrap")}>
               <Button icon="pi pi-trash" tooltip="Удалить документ" tooltipOptions={{ position: 'top' }} type="button" rounded severity="danger" onClick={() => drop(data.id)}/>
            </div>
         </div>
      )
   }

   const readFiles = async () => {
      const res = await fetch(`/api/attachment/list`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            bucket_name: bucketName
         }),
         cache: 'force-cache'
      });
      const data = await res.json();
      setItems(data.data);
   }

   return (      
      <React.Fragment>
         <DataScroller value={items} itemTemplate={itemTemplate} rows={items.length} inline scrollHeight="20rem" className={classNames(styles.fileList, "border-round file-list-container")}/>
         <Toast ref={toast} />
      </React.Fragment>      
   );
};

export default ItrFileList;
