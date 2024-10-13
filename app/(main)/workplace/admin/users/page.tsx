'use client'
import {TreeNode} from "primereact/treenode";
import ItrGrid from "@/components/ItrGrid";
import React, {useRef, useState} from "react";
import {ColumnGroup} from "primereact/columngroup";
import {Row} from "primereact/row";
import {Column} from "primereact/column";
import {IGridRef} from "@/models/IGridRef";
import DateHelper from "@/services/date.helpers";
import {IUser} from "@/models/IUser";
import {ConfirmDialog} from "primereact/confirmdialog";
import ItrCard from "@/components/ItrCard";
import {Toast} from "primereact/toast";
import {ICardRef} from '@/models/ICardRef'
import {FormikErrors, useFormik} from "formik";
import RecordState from "@/models/enums/record-state";
import { TabView, TabPanel } from 'primereact/tabview';
import {InputText} from 'primereact/inputtext';
import {classNames} from "primereact/utils";
import {Calendar} from "primereact/calendar";
import {TreeSelect} from "primereact/treeselect";
import {appRoles} from "@/prisma/roles/index";;
import { InputSwitch } from "primereact/inputswitch";
import circleProgress from '@/services/circle.progress.js'
import CrudHelper from "@/services/crud.helper.js"
import CRUD from "@/models/enums/crud-type";
import { FileUpload, FileUploadHeaderTemplateOptions, ItemTemplateOptions } from 'primereact/fileupload';
import AttachService from "@/services/attachment.service"


const Users = () => {
   const controllerName = 'users';
   const emptyUser: IUser = {begin_date: new Date, end_date: null, roles: [], attachment_id: null};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [divisions, setDivisions] = useState<TreeNode[]>([]);
   // При закрытии карточки через отмену восстанавливаем роли отсюда
   const [savedUserRoles, setSavedUserRoles] = useState<any>({});
   const [currentUserRoles, setCurrentUserRoles] = useState<any>({});
   const fileUploadRef = useRef<FileUpload>(null);
   const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
   const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
   const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
   const [attachChanged, setAttachChanged] = useState<boolean>(false);
   const [attachmentId, setAttachmentId] = useState<number | undefined | null>(null);
   const [imageSrc, setImageSrc] = useState('');


//#region GRID
   const periodColumn = (
      <ColumnGroup>
         <Row>
            <Column header="" rowSpan={2}/>
            <Column header="Подразделение" rowSpan={2} sortable field="division.name"/>
            <Column header="Учетная запись" rowSpan={2} sortable field="email"/>
            <Column header="Период действия" colSpan={2}/>
            <Column header="" rowSpan={2}/>
         </Row>
         <Row>
            <Column header="Дата начала" sortable field="begin_date"/>
            <Column header="Дата окончания" sortable field="end_date"/>
         </Row>
      </ColumnGroup>
   );

   const beginDateTemplate = (rowData: IUser) => {
      return DateHelper.formatDate(rowData.begin_date);
   };

   const endDateTemplate = (rowData: IUser) => {
      return DateHelper.formatDate(rowData.end_date);
   };

   const gridColumns = [
         <Column
            key={1}
            field="division.name"
            sortable
            header="Подразделение"
            style={{ width: '40%' }}>
         </Column>,
         <Column
            key={2}
            field="email"
            sortable
            header="Учетная запись"
            style={{ width: '40%' }}>
         </Column>,
         <Column
            key={3}
            sortable
            field="begin_date"
            body={beginDateTemplate}
            style={{ width: '10%' }}>
         </Column>,
         <Column
            key={4}
            sortable
            field="end_date"
            body={endDateTemplate}
            style={{ width: '10%' }}>
         </Column>
         
      ];
//#endregion

//#region Card
   const getDivisionsTree = () => {
      const prepareData = (data: any) : TreeNode[] => {
         const result: TreeNode[] = [];
         //@ts-ignore
         data?.map((item, index) => {
            result.push({
                  id: item.data.id?.toString(),
                  key: item.data.id,
                  label: item.data.name,
                  icon: `pi pi-fw ${item.children?.length === 0 ? "pi-briefcase" : "pi-folder"}`,
                  children: prepareData(item.children)
            });
         });
         return result;
      }
      CrudHelper.crud('division', CRUD.read, {}).then((item) => {
         if (item.status === 'success') {
            let treeNodes = prepareData(item.data);
            setDivisions(treeNodes);
         }
      });
   }

   const user = useFormik<IUser>({
      initialValues: emptyUser,
      validate: (data) => {
         let errors: FormikErrors<IUser> = {};
         if (!data.email){
            errors.email = "Адрес электронной почты должен быть заполнен!";
         }
         return errors;
      },
      onSubmit: () => {
         user.resetForm();
      }
   });

   const checkBox = (entry: any) => {
      return (
         <div key={`role-outerDiv-${entry.role}`} className="flex justify-content-between mb-3">
            <div key={`role-innerDiv-${entry.role}`}>{entry.name}</div>
            <InputSwitch key={`role-${entry.role}`} checked={entry.active} onChange={(e) => switchChecked(e.value, entry)} tooltip="Выберите для доступности роли"/>
         </div>
      )
   }

   const switchChecked = (checked: boolean | null | undefined, entry: any) => {
      let _roles = currentUserRoles.map((item: any) => {
         if (item.role === entry.role) {
            item.active = checked;
         }
         return item;
      });
      setCurrentUserRoles(_roles);
   }

   const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
      const { className, chooseButton, cancelButton } = options;

      return (
         <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
            {chooseButton}
            {cancelButton}
         </div>
      );
   };

   const onTemplateRemove = (file: File, callback: Function) => {
      callback();
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
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
         <TabView>
            <TabPanel header="Основные данные">
               <div className="p-fluid formgrid grid">
                  <div className="field col-12">
                     <label htmlFor="email">Адрес электронной почты</label>
                     <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                           <i className="pi pi-envelope"></i>
                        </span>
                        <InputText id="name"  placeholder="Адрес электронной почты"
                                          className={classNames({"p-invalid": submitted && !user.values.email})}
                                          value={user.values.email}
                                          onChange={(e) => user.setFieldValue('email', e.target.value)} required autoFocus type="email" tooltip="Адрес электронной почты"/>
                     </div>
                  </div>                  
                  <div className="field col-12">
                     <label htmlFor="division_id">Подразделение</label>
                     <TreeSelect
                           filter
                           id="division" className={classNames({"p-invalid": submitted && !user.values.division_id})}
                           required options={divisions} value={user.values.division_id?.toString()} onChange={(e) => user.setFieldValue('division_id', e.target.value)}/>
                  </div>
               </div>
            </TabPanel>
            <TabPanel header="Роли">
               {
                  //@ts-ignore
                  user.values?.roles?.map((entry) => checkBox(entry))
               }
            </TabPanel>
            <TabPanel header="Фото">
            <FileUpload ref={fileUploadRef} accept="image/*" maxFileSize={1000000}
               headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={imageSrc === '' ? emptyTemplate : loadedTemplate}
               chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} onSelect={(e) => setAttachChanged(true) } onRemove={(e) => setAttachChanged(true) }/>
            </TabPanel>
         </TabView>
      </div>
   );
//#endregion

//#region CRUD
   const saveUserRoles = (currentRoles: any) => {
      let _roles = [];
      for(const role of currentRoles){
         //@ts-ignore
         _roles.push({role: role.role, name: role.name, active: role.active});
      }
      setSavedUserRoles(_roles);
   }
   const createUser = () => {
      emptyUser.roles = Object.entries(appRoles).map((role) => {
         return {
            role: role[0],
            name: role[1],
            active: false
         }
      });
      setCardHeader('Создание нового пользователя');
      getDivisionsTree();
      user.setValues(emptyUser);
      setAttachmentId(null);
      setCurrentUserRoles(emptyUser.roles);
      saveUserRoles(emptyUser.roles);
      setRecordState(RecordState.new);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateUser = async (data: IUser) => {
      setCardHeader('Редактирование пользователя');
      getDivisionsTree();
      user.setValues(data);
      const attach = await AttachService.read(data.attachment_id);
      setImageSrc(attach);
      setCurrentUserRoles(data.roles);
      saveUserRoles(data.roles);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteUser = async (data: any) => {
      return await CrudHelper.crud(controllerName, CRUD.delete, { id: data });
   }

   const saveUser = async () => {
      setSubmitted(true);
      if (!user.isValid) {
         const errors = Object.values(user.errors);
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
         if (attachChanged) {
            const attach = fileUploadRef.current?.getFiles()[0];
            if (attach) {
               const attachResult = await AttachService.save(attach, attachmentId);
               user.values.attachment_id = attachResult.data.id;
            }
         }

         const res = recordState === RecordState.new ?
            await CrudHelper.crud(controllerName, CRUD.create, user.values) :
            await CrudHelper.crud(controllerName, CRUD.update, user.values);

         setIsLoading(false);
         setAttachChanged(false);

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

   const cancelUser = async () => {
      for (const role of user.values.roles) {
         //@ts-ignore
         let _role = savedUserRoles.find(r => r.role === role.role);
         if (_role) {
            role.active = _role.active;
         }
      }
      setCurrentUserRoles(savedUserRoles);
   }
//#endregion
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
               <h3>Пользователи системы</h3>
               <ItrGrid
                  controller={controllerName}
                  create={createUser}
                  update={updateUser}
                  drop={deleteUser}
                  tableStyle={{ minWidth: '50rem' }}
                  showClosed={true}
                  headerColumnGroup={periodColumn}
                  columns={gridColumns}
                  sortMode="multiple"
                  ref={grid}/>
               <ItrCard
                  header={cardHeader}
                  width={'35vw'}
                  save={saveUser}
                  cancel={cancelUser}
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

export default Users;
