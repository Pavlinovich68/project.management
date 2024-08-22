'use client'
import React, {useEffect, useRef, useState} from "react";
import {TreeTable} from 'primereact/treetable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {ICardRef} from '../../../../../models/ICardRef'
import {FormikErrors, useFormik} from "formik";
import {Division} from "../../../../../models/Division";
import RecordState from "@/models/enums/record-state";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import ItrCard from "@/components/ItrCard";
import {classNames} from "primereact/utils";
import { ConfirmPopup } from 'primereact/confirmpopup';
import CrudHelper from "@/services/crud.helper.js"
import AttachService from "@/services/attachment.service"
import CRUD from "@/models/enums/crud-type";
import { TabView, TabPanel } from 'primereact/tabview';
import { FileUpload, FileUploadHeaderTemplateOptions, ItemTemplateOptions } from 'primereact/fileupload';

const Divisions = () => {
   const controllerName = "division";
   const emptyDivision: Division = {};
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [divisions, setDivisions] = useState([]);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [visibleConfirm, setVisibleConfirm] = useState(false);
   const [globalFilter, setGlobalFilter] = useState<string>('');
   const [deletedDivision, setDeletedDivision] = useState<Division>(emptyDivision);
   const fileUploadRef = useRef<FileUpload>(null);
   const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
   const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
   const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
   const [imageSrc, setImageSrc] = useState('');
   const [attachChanged, setAttachChanged] = useState<boolean>(false);
   const [attachmentId, setAttachmentId] = useState<number | undefined | null>(null);

   useEffect(() => {
      CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
         setDivisions(result.data);
      });
   }, []);

   //#region Card
   const division = useFormik<Division>({
      initialValues: emptyDivision,
      validate: (data) => {
         let errors: FormikErrors<Division> = {};
         if (!data.name){
            errors.name = "Наименование подразделения должно быть заполнено!";
         }
         if (!data.short_name){
            errors.short_name = "Короткое наименование подразделения должно быть заполнено!";
         }
         return errors;
      },
      onSubmit: () => {
         division.resetForm();
      }
   });

   const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
      const { className, chooseButton, cancelButton } = options;

      return (
         <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
            {chooseButton}
            {cancelButton}
         </div>
      );
   };

   const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
      const file = inFile as File;
      //@ts-ignore
      const objectURL = file.objectURL;
      return (
         <div className="flex align-items-center flex-wrap">
            <div className="flex align-items-center" style={{ width: '40%' }}>
               <img alt={file.name} role="presentation" src={objectURL} width={100} />
            </div>
         </div>
      );
   };

   const loadedTemplate = () => {
      return (
         <div className="flex align-items-center flex-wrap">
            <div className="flex align-items-center" style={{ width: '40%' }}>
               <img alt={"loadedFromDataBaseImage"} role="presentation" src={imageSrc} width={100} />
            </div>
         </div>
      );
   };

   const emptyTemplate = () => {
      return (
         <div className="flex align-items-center flex-column">
            <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
            <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
               Перетащите сюда изображение
            </span>
         </div>
      );
   };

   const card = (
      <div className="card p-fluid">
         <TabView>
            <TabPanel header="Основные данные">
               <div className="p-fluid formgrid grid">
                  <div className="field col-12">
                     <label htmlFor="name">Наименование подразделения</label>
                     <InputText id="name"  placeholder="Наименование"
                                          className={classNames({"p-invalid": submitted && !division.values.name})}
                                          value={division.values.name}
                                          onChange={(e) => division.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
                  </div>
                  <div className="field col-12 md:col-6">
                     <label htmlFor="short_name">Короткое наименование</label>
                     <InputText id="short_name"  placeholder="Короткое наименование"
                                       className={classNames({"p-invalid": submitted && !division.values.short_name})}
                                       value={division.values.short_name}
                                       onChange={(e) => division.setFieldValue('short_name', e.target.value)} required autoFocus type="text"/>
                  </div>
                  <div className="field col-12 md:col-6">
                     <label htmlFor="contacts">Контактная информация</label>
                     <InputText id="contacts" placeholder="Контактная информация"
                                       value={division.values.contacts}
                                       onChange={(e) => division.setFieldValue('contacts', e.target.value)} required autoFocus type="text"/>
                  </div>
               </div>
            </TabPanel>
            <TabPanel header="Логотип">
            <FileUpload ref={fileUploadRef} accept="image/*" maxFileSize={1000000}
                  headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={imageSrc === '' ? emptyTemplate : loadedTemplate}
                  chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} onSelect={(e) => setAttachChanged(true) } onRemove={(e) => setAttachChanged(true) }/>
            </TabPanel>
         </TabView>
      </div>
   )

   //#endregion

   //#region CRUD
   const createDivision = (data: Division | null) => {
      setCardHeader('Создание нового подразделения');
      emptyDivision.parent_id = data?.id;
      division.setValues(emptyDivision);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const editDivision = async (data: Division) => {
      setCardHeader('Редактирование подразделения');
      division.setValues(data);
      const attach = await AttachService.read(data.attachment_id);
      setImageSrc(attach);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteDivision = async () => {
      if (deletedDivision) {
         CrudHelper.crud(controllerName, CRUD.delete, {id: deletedDivision.id}).then((result) => {
            CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
               setDivisions(result.data);
            });
         });
      }
   }

   const saveDivision = async () => {
      setSubmitted(true);
      if (!division.isValid) {
         const errors = Object.values(division.errors);
         toast.current?.show({
            severity: 'error',
            summary: 'Ошибка сохранения',
            content: (<div className="flex flex-column">
               <div className="text-center mb-2">
                  <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                  <h3 className="text-red-500">Ошибка сохранения</h3>
               </div>
               {errors.map((item) => {
                  return (
                     // eslint-disable-next-line react/jsx-key
                     <p className="flex align-items-left m-0">
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

         if (attachChanged) {
            const attach = fileUploadRef.current?.getFiles()[0];
            if (attach) {
               const attachResult = await AttachService.save(attach, attachmentId);
               division.values.attachment_id = attachResult.data.id;
            }
         }

         const res = recordState === RecordState.new ?
            await CrudHelper.crud(controllerName, CRUD.create, {
               name: division.values.name,
               short_name: division.values.short_name,
               contacts: division.values.contacts,
               parent_id: division.values.parent_id,
               attachment_id: division.values.attachment_id
            }) :
            await CrudHelper.crud(controllerName, CRUD.update, {
               id: division.values.id,
               name: division.values.name,
               short_name: division.values.short_name,
               contacts: division.values.contacts,
               attachment_id: division.values.attachment_id
            });

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
            setIsLoading(false);
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            CrudHelper.crud(controllerName, CRUD.read, {}).then((result)=>{
               setDivisions(result.data);
            });
            setIsLoading(false);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
   //#endregion

   const actionTemplate = (item: any) => {
      return (
         <div className="flex flex-wrap gap-2">
            <Button type="button" icon="pi pi-pencil" severity="info" rounded tooltip="Редактировать" tooltipOptions={{position: "bottom"}} onClick={() => editDivision(item?.data)}></Button>
            <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createDivision(item?.data)}></Button>
            <Button type="button" icon="pi pi-trash" severity="danger" rounded tooltip="Удалить" tooltipOptions={{position: "bottom"}} onClick={() => {setVisibleConfirm(true); setDeletedDivision(item?.data)}}></Button>
            <ConfirmPopup
               visible={visibleConfirm}
               onHide={() => setVisibleConfirm(false)}
               message="Вы действительно хотите удалить текущую запись?"
               icon="pi pi-exclamation-triangle"
               acceptLabel="Да"
               rejectLabel="Нет"
               accept={() => deleteDivision()}/>
         </div>
      );
   };

   const getHeader = () => {
      return (
         <div className="grid">
            <div className="col-6">
               <div className="flex justify-content-start">
                  <Button type="button" icon="pi pi-plus" severity="success" rounded tooltip="Добавить новое" tooltipOptions={{position: "bottom"}} onClick={() => createDivision(null)}></Button>
               </div>
            </div>
            <div className="col-6">
               <div className="flex justify-content-end">
                  <div className="p-input-icon-left">
                     <i className="pi pi-search"></i>
                     <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Поиск" />
                  </div>
               </div>
            </div>
         </div>
      );
   };

   let header = getHeader();

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Подразделения</h3>
               <TreeTable value={divisions} expandedKeys={{'0-1': true}}  tableStyle={{ minWidth: '50rem' }} globalFilter={globalFilter} resizableColumns showGridlines header={header} filterMode="strict">
                  <Column field="name" header="Наименование структурного подразделения" expander style={{width: '60%'}}></Column>
                  <Column field="short_name" header="Короткое наименование" style={{width: '15rem'}}></Column>
                  <Column field="contacts" header="Контактная информация"></Column>
                  <Column body={actionTemplate} style={{width: "165px"}} />
               </TreeTable>
               <ItrCard
                  header={cardHeader}
                  width={'50vw'}
                  save={saveDivision}
                  body={card}
                  hiddenSave={false}
                  ref={editor}
               />
               <ConfirmDialog />
               <Toast ref={toast} />
            </div>
         </div>
      </div>
   );
};

export default Divisions;
