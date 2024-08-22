'use client'
import { IContractAttachment } from "@/models/IContractAttachment";
import React, {useRef, useState} from "react";
import ItrGrid from "./ItrGrid";
import { Column } from "primereact/column";
import { IGridRef } from "@/models/IGridRef";
import Link from "next/link";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import CRUD from "@/models/enums/crud-type";
import { classNames } from "primereact/utils";

const ContractAttachments = ({readOnly, data} : {readOnly: boolean, data: IContractAttachment[] | undefined}) => {
   const toast = useRef<Toast>(null);
   const grid = useRef<IGridRef>(null);
   const [attachChanged, setAttachChanged] = useState<boolean>(false);

//#region //ANCHOR - CRUD
const addAttachment = (e: FileUploadSelectEvent) => {
   setAttachChanged(true);
   try {
      data?.push({
         id: undefined,
         file_name: e.files[0].name,
         file: e.files[0],
         is_real_file: true
      });
      grid.current?.reload();
   } catch (e: any) {
      console.log(`%cError: ${e.message}`, 'color: #f00');   
   }
}

const deleteAttachment = async (item: IContractAttachment) => {
   if (data?.includes(item)) {
      data.splice(data.indexOf(item), 1);
      if (item.id !== undefined) {
         const res = await fetch(`/api/contract/attachment/crud`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({operation: CRUD.delete, model: {id: item.id}}),
         });
         const data = await res.json();
         if (data.status !== 'success')
            return;
      }
      grid.current?.reload();
   }
}
//#endregion

const headerTemplate = (
   <FileUpload 
      mode="basic"
      cancelLabel="Отмена"
      chooseLabel="Добавить файл вложения"
      uploadLabel="Загрузить"
      onSelect={(e) => addAttachment(e) }
      className='itr-upload-toolbar' 
      name="contractAttachmentUploader" 
      accept=".*" 
      maxFileSize={1000000} 
      emptyTemplate={
         <p className="m-0">Перетащите сюда файлы для прикрепления их к контракту.</p>
      } 
   />
);
//ANCHOR - Чтение вложений
const attachClick = async (rowData: IContractAttachment) => {
   const res = await fetch(`/api/attachment/read?id=${rowData.attachment_id}`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      }
   });
   const data = await res.json();
   if (data.status === 'success' && rowData.file_name) {
      const link = document.createElement('a');
      link.href = data.data.body;
      link.download = rowData.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }
}
const fileName = (rowData: IContractAttachment) => {
   return rowData.is_real_file ? <Link id={`link${rowData.id}`} onClick={(a) => {attachClick(rowData)}} href='#'>{rowData.file_name}</Link> : <Link id={`link${rowData.id}`} href={rowData?.file_link??"~"}>{rowData.file_name}</Link>;
};
const gridColumns = [
   <Column
      key="attachmentColumn1"
      body={fileName}
      sortable
      header="Имя файла"
      style={{width: "100%"}}>
   </Column>
];

   return (
      <div className={classNames("grid", readOnly ? "form-disabled" : "")}>
         <div className="col-12" style={{maxHeight: '35rem'}}>
            <ItrGrid
               data={data}
               drop={deleteAttachment}
               tableStyle={{ minWidth: '30rem' }}
               showClosed={false}
               columns={gridColumns}
               sortMode="multiple"
               search='false'
               editVisible={false}
               defaultPageSize={5}
               showHeader={false}
               headerTemplate={headerTemplate}
               ref={grid}
            />
         </div>
      </div>
   );
};

export default ContractAttachments;
