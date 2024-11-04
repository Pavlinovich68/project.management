'use client'
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
import {classNames} from "primereact/utils";
import {appRoles} from "@/prisma/roles/index";;
import { InputSwitch } from "primereact/inputswitch";
import CrudHelper from "@/services/crud.helper.js"
import CRUD from "@/models/enums/crud-type";
import { FileUpload, ItemTemplateOptions } from 'primereact/fileupload';
import AttachService from "@/services/attachment.service"
import { Dropdown } from "primereact/dropdown";
import { IBaseEntity } from "@/models/IBaseEntity";
import { Avatar } from "primereact/avatar";

const Users = () => {
   const controllerName = 'users';
   const emptyUser: IUser = {roles: [], attachment_id: null};
   const grid = useRef<IGridRef>(null);
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
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
   const [employees, setEmployees] = useState<IBaseEntity[]>();

   const readEmployees = async () => {
      const res = await fetch(`/api/staff/employee/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setEmployees(data.data);
   }   
//#region GRID
   const periodColumn = (
      <ColumnGroup>
         <Row>
            <Column header="" rowSpan={2}/>
            <Column header="Сотрудник" rowSpan={2} sortable field="division.name"/>
            <Column header="Учетная запись" rowSpan={2} sortable field="employee.email"/>
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
      return DateHelper.formatDate(rowData.employee?.begin_date);
   };

   const endDateTemplate = (rowData: IUser) => {
      return DateHelper.formatDate(rowData.employee?.end_date);
   };

   const gridColumns = [
         <Column
            key={1}
            field="employee.name"
            sortable
            header="Сотрудник"
            style={{ width: '40%' }}>
         </Column>,
         <Column
            key={2}
            field="employee.email"
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
   const user = useFormik<IUser>({
      initialValues: emptyUser,
      validate: (data) => {
         let errors: FormikErrors<IUser> = {};
         if (!data.employee){
            errors.employee = "Сотрудник должен быть указан!";
         }
         return errors;
      },
      onSubmit: () => {
         user.resetForm();
      }
   });

   const icon = (
      <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100   px" fill="#e8eaed"><path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z"/></svg>
   )

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

   const emptyTemplate = () => {
      return (
            <div className="flex align-items-center flex-column">
               {
                  imageSrc ?
                     <Avatar image={imageSrc} size="large" shape="circle" className='itr-card-avatar block-h-center'/>
                  :
                     <React.Fragment>
                        <Avatar icon={icon} size="large" shape="circle" className='itr-card-avatar block-h-center'/>
                        <span style={{ fontSize: '1em', color: 'var(--text-color-secondary)' }} className="my-5">
                           Перетащите сюда изображение
                        </span>
                     </React.Fragment>
               }
            </div>
         );
   };

   const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
      const file = inFile as File;
      //@ts-ignore
      const objectURL = file.objectURL;
      return (
         <div className="flex align-items-center flex-column">
            <Avatar image={objectURL} size="large" shape="circle" className='itr-card-avatar block-h-center'/>
         </div>
      );
   };

   const card = (
      <div className="card p-fluid">
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
         <TabView>
            <TabPanel header="Основные данные">
               <div className="field col-12">
                  <label htmlFor="rate" className="mr-3">Сотрудник</label>
                  <div>
                     <Dropdown                        
                        value={user.values.employee?.id}
                        className={classNames({"p-invalid": submitted && !user.values.employee})} 
                        required 
                        optionLabel="name" 
                        optionValue="id" 
                        filter
                        options={employees}
                        onChange={(e) => {
                           const item = employees?.find(item => item.id === e.value);
                           if (item) {
                              user.setFieldValue('employee', item)
                           }
                        }}
                     />
                  </div>
               </div>
               <FileUpload ref={fileUploadRef} accept="image/*" maxFileSize={1000000}
                  headerTemplate={<></>} 
                  itemTemplate={itemTemplate} 
                  emptyTemplate={emptyTemplate}
                  chooseOptions={chooseOptions} 
                  uploadOptions={uploadOptions} 
                  cancelOptions={cancelOptions} 
                  onSelect={(e) => setAttachChanged(true)} 
                  onRemove={(e) => setAttachChanged(true)}
               />
            </TabPanel>
            <TabPanel header="Роли">
               {
                  //@ts-ignore
                  user.values?.roles?.map((entry) => checkBox(entry))
               }
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
      readEmployees();
      setCardHeader('Создание нового пользователя');
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
      readEmployees();
      setCardHeader('Редактирование пользователя');
      user.setValues(data);
      //@ts-ignore
      const attach = await AttachService.read(data.avatar?.id);
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
                  showClosed={false}
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
