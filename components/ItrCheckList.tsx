'use client'
import React, {useRef, useState, useEffect} from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Tree, TreeExpandedKeysType, TreeNodeTemplateOptions } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { CheckList, CheckListSection, CheckListItem } from "@/models/CheckList";
import CrudHelper from "@/services/crud.helper";
import CRUD from "@/models/enums/crud-type";
import { BaseEntity } from "@/models/BaseEntity";
import { InputSwitch } from "primereact/inputswitch";
import ItrCard from "./ItrCard";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { ICardRef } from "@/models/ICardRef";
import RecordState from "@/models/enums/record-state";
import { FormikErrors, useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import GuidHelper from "@/services/guid.helper";
import { Calendar } from "primereact/calendar";
import AddButton from '@mui/icons-material/PlaylistAdd';
import { ClassNames } from "@emotion/react";

enum cardType {
   checkList,
   section,
   item
}

const CheckListControl = ({readOnly, id}: {readOnly: boolean, id: number}) => {
   const controllerName = 'check_list';
   const emptyCheckList: CheckList = {name: '', sections: []};
   const emptyCheckListSection: CheckListSection = {name: '', order_no: 0, items: []};
   const emptyCheckListItem: CheckListItem = {name: '', order_no: 0, is_closed: false};
   const toast = useRef<Toast>(null);
   const [checkList, setCheckList] = useState<CheckList>();
   const [cardHeader, setCardHeader] = useState('');
   const editor = useRef<ICardRef>(null);
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);const [divisions, setDivisions] = useState<BaseEntity>();
   const [nodes, setNodes] = useState<TreeNode[]>();
   const [editorType, setEditorType] = useState<cardType>();
   const [expanded, setExpanded] = useState<TreeExpandedKeysType>();

   useEffect(() => {
      readCheckListData(id).then((data) => setNodes(convertToTreeData(data?.sections)));
   }, [id]);

//#region //************************************ Formik ***************************************//
   const checklist = useFormik<CheckList>({
      initialValues: emptyCheckList,
      validate: (data) => {
         let errors: FormikErrors<CheckList> = {};
         if (!data.name){
            errors.name = "Наименование чек-листа должно быть заполнено!";
         }
         return errors;
      },
      onSubmit: () => {
         checklist.resetForm();
      }
   });

   const checklistSection = useFormik<CheckListSection>({
      initialValues: emptyCheckListSection,
      validate: (data) => {
         let errors: FormikErrors<CheckListSection> = {};
         if (!data.name){
            errors.name = "Наименование этапа должно быть заполнено!";
         }
         return errors;
      },
      onSubmit: () => {
         checklistSection.resetForm();
      }
   });

   const checklistItem = useFormik<CheckListItem>({
      initialValues: emptyCheckListItem,
      validate: (data) => {
         let errors: FormikErrors<CheckListItem> = {};
         if (!data.name){
            errors.name = "Наименование этапа должно быть заполнено!";
         }
         if (!data.end_point){
            errors.end_point = "Дата контрольной точки должна быть указана!";
         }
         return errors;
      },
      onSubmit: () => {
         checklistSection.resetForm();
      }
   });
//#endregion

//#region //***************************** Read and convert data *******************************//
   const convertToTreeData = (data: CheckListSection[] | undefined) => {
      if (!data) {
         return undefined;
      }
      const result = data.sort((a, b) => a.order_no - b.order_no).map((item) => {
         item.guid = item.guid??GuidHelper.newGuid();
         const treeItem: TreeNode = {
            key: item.guid??GuidHelper.newGuid(),
            label: item.name,
            data: item,
            children: item.items?.sort((a, b) => a.order_no - b.order_no).map((child) => {
               child.guid = child.guid??GuidHelper.newGuid();
               child.parent = item;
               const childItem: TreeNode = {
                  key: child.guid??GuidHelper.newGuid(),
                  label: child.name,
                  data: child
               };
               return childItem;      
            })
         }
         return treeItem;
      });

      return result;
   }

   const readCheckListData = async (project_id: number) => {
      const res = await CrudHelper.crud(controllerName, CRUD.read, {}, {project_id: project_id})
      setCheckList(res?.data);
      return res?.data;
   }
   
   const readDivisions = async () => {
      const res = await fetch(`/api/division/list`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      setDivisions(data.data);
   }
//#endregion

//#region //******************************* Actions CheckList *********************************//
   const createCheckList = async () => {
      setCardHeader('Создание нового чек-листа');
      readDivisions();
      emptyCheckList.close_date = new Date(new Date().getFullYear(), 11, 31);
      checklist.setValues(emptyCheckList);
      setRecordState(RecordState.new);
      setEditorType(cardType.checkList);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateCheckList = async (data: CheckList | undefined) => {
      if (!data) {
         return;
      }
      setCardHeader('Редактирование чек-листа');
      readDivisions();
      setEditorType(cardType.checkList);
      checklist.setValues(data);
      setRecordState(RecordState.edit);
      setSubmitted(false);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteCheckList = async (data: any) => {
      setIsLoading(true);
      const result = await CrudHelper.crud(controllerName, CRUD.delete, { id: data });
      if (result.status !== 'error') {
         readCheckListData(id).then((data) => setNodes(convertToTreeData(data?.sections)))
      } else {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: result.data, life: 3000});
      }
      setIsLoading(false);
   }
//#endregion

//#region //******************************** Actions Section **********************************//
   const createSection = async () => {
      setEditorType(cardType.section);
      setCardHeader("Создание нового этапа");
      setRecordState(RecordState.new);
      checklistSection.setValues(emptyCheckListSection);
      checklistSection.setFieldValue('guid', GuidHelper.newGuid());

      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateSection = async (node: TreeNode) => {      
      setEditorType(cardType.section);
      setCardHeader("Редактирование этапа");
      setRecordState(RecordState.edit);
      checklistSection.setValues(node.data);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const viewSection = async (node: TreeNode) => {      
      setEditorType(cardType.section);
      setCardHeader("Просмотр этапа");
      setRecordState(RecordState.ready);
      checklistSection.setValues(node.data);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteSection = async (node: TreeNode) => {
      setIsLoading(true);
      const result = await CrudHelper.crud('check_list/section', CRUD.delete, {id: node.data.id});
      if (result.status !== 'error') {
         const index = checkList?.sections?.indexOf(node.data);
         if (index !== undefined && index > -1) {
            checkList?.sections?.splice(index, 1);
            setNodes(convertToTreeData(checkList?.sections));
         }
      } else {
         toast.current?.show({severity:'error', summary: 'Ошибка удаления', detail: result.data, life: 3000});
      }
      setIsLoading(false);
   }
//#endregion

//#region //********************************* Actions Items ***********************************//
   const createItem = async (node: TreeNode) => {
      setEditorType(cardType.item);
      setCardHeader("Создание новой контрольной точки");
      setRecordState(RecordState.new);
      //@ts-ignore
      emptyCheckListItem.parent = {id: (node.data as CheckListSection).id};
      checklistItem.setValues(emptyCheckListItem);
      checklistItem.setFieldValue('guid', GuidHelper.newGuid());

      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const updateItem = async (node: TreeNode) => {
      setEditorType(cardType.item);
      setCardHeader("Редактирование контрольной точки");
      setRecordState(RecordState.edit);
      node.data.parent = {id: node.data.section_id};
      checklistItem.setValues(node.data);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const viewItem = async (node: TreeNode) => {
      setEditorType(cardType.item);
      setCardHeader("Просмотреть контрольной точки");
      setRecordState(RecordState.ready);
      node.data.parent = {id: node.data.section_id};
      checklistItem.setValues(node.data);
      if (editor.current) {
         editor.current.visible(true);
      }
   }

   const deleteItem = async (node: TreeNode) => {
      setIsLoading(true);         
      try {
         await CrudHelper.crud('check_list/section/item', CRUD.delete, {id: node.data.id});      
         const section = node.data.parent;
         if (section) {
            const index = section.items.indexOf(node.data);
            if (index !== undefined && index > -1) {
               let _expandedKeys = { ...expanded };
               section.items.splice(index, 1);            
               setNodes(convertToTreeData(checkList?.sections));            
               setExpanded(_expandedKeys);            
            }
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
      }      
      setIsLoading(false);
   }
//#endregion

//#region //************************************* Save ****************************************//
   const save = () => {
      switch (editorType) {
         case cardType.checkList: {
            checklistSave();
            return;
         }
         case cardType.section: {
            sectionSave();
            return;
         }
         default: {
            itemSave();
            return;
         }
      }
   }

   const checklistSave = async () => {
      setSubmitted(true);
      if (!checklist.isValid) {
         const errors = Object.values(checklist.errors);
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
         checklist.values.sections = undefined;
         const res = await CrudHelper.crud('check_list', recordState === RecordState.new ? CRUD.create : CRUD.update, checklist.values, {project_id: Number(id)}) ;
         setIsLoading(false);

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            readCheckListData(id).then((data) => setNodes(convertToTreeData(data?.sections)));
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }

   const sectionSave = async () => {
      if (!checklistSection.isValid) {
         const errors = Object.values(checklistSection.errors);
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
         checklistSection.setFieldValue('items', undefined);
         const model = checklistSection.values;
         model.items = undefined;
         const res = await CrudHelper.crud('check_list/section', recordState === RecordState.new ? CRUD.create : CRUD.update, model, {check_list_id: checkList?.id}) ;
         setIsLoading(false);

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            readCheckListData(id).then((data) => setNodes(convertToTreeData(data?.sections)));
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }

   const itemSave = async () => {
      if (!checklistItem.isValid) {
         const errors = Object.values(checklistItem.errors);
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
         const res = await CrudHelper.crud('check_list/section/item', recordState === RecordState.new ? CRUD.create : CRUD.update, checklistItem.values, {section_id: checklistItem?.values.parent?.id}) ;
         setIsLoading(false);         

         if (res.status === 'error'){
            toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: res.data, sticky: true});
         } else {
            if (editor.current) {
               editor.current.visible(false);
            }
            const _nodes = nodes;
            const _section = _nodes?.find((i) => i.data.id === res.data.section_id);
            const _item = _section?.children?.find((i) => i.data.id === res.data.id) ;
            (_item?.data as CheckListItem).name = res.data.name;
            (_item?.data as CheckListItem).is_closed = res.data.is_closed;
            (_item?.data as CheckListItem).order_no = res.data.order_no;
            (_item?.data as CheckListItem).end_point = res.data.end_point;
            setNodes(_nodes);
         }
      } catch (e: any) {
         toast.current?.show({severity:'error', summary: 'Ошибка сохранения', detail: e.message, life: 3000});
         setIsLoading(false);
      }
   }
//#endregion

//#region //************************************* Cards ***************************************//
   const checklistCard = (
      <React.Fragment>
         <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>            
         <div className="p-fluid formgrid grid">
            <div className="field col-12">
               <label htmlFor="is_priority" className="mr-3">Ответственное Подразделение</label>
               <div>
                  <Dropdown
                     value={checklist.values.division?.id}
                     className={classNames({"p-invalid": submitted && !checklist.values.division})}
                     required
                     optionLabel="name" 
                     optionValue="id" 
                     filter
                     //@ts-ignore
                     options={divisions}
                     onChange={(e) => {
                        //@ts-ignore
                        const item = divisions?.find(item => item.id === e.value);
                        if (item) {
                           checklist.setFieldValue('division', item)
                        }
                     }}
                  />
               </div>
            </div>
            <div className="field col-12">
               <label htmlFor="name">Наименование чек-листа</label>
               <InputText id="name"  placeholder="Наименование"
                                    className={classNames({"p-invalid": submitted && !checklist.values.name})}
                                    value={checklist.values.name}
                                    onChange={(e) => checklist.setFieldValue('name', e.target.value)} required autoFocus type="text"/>
            </div>
            <div className="field col-4">
               <label htmlFor="close_date">Дата закрытия</label>
               <Calendar 
                  id="close_date" 
                  value={checklist.values.close_date !== null ? new Date(checklist.values.close_date as Date) : null} 
                  onChange={(e) => checklist.setFieldValue('close_date', e.target.value)} 
                  dateFormat="dd MM yy" 
                  locale="ru" 
                  showIcon required  showButtonBar 
                  tooltip="Дата закрытия"/>
            </div>
         </div>
      </React.Fragment>
   )

   const sectionCard = (
      <div className={classNames("p-fluid formgrid grid", readOnly?'form-disabled':'')}>
         <label className="mb-1" htmlFor="name">Наименование этапа</label>
         <InputText id="unit_variation"
            value={checklistSection.values.name}
            onChange={(e) => checklistSection.setFieldValue('name', e.target.value)} type="text" required autoFocus tooltip="Наименование этапа"/>
      </div>
   )

   const itemCard = (
      <div className={classNames("p-fluid formgrid grid", readOnly?'form-disabled':'')}>
         <div className="field col-12">
            <label htmlFor="name">Наименование контрольной точки</label>
            <InputText id="name"  placeholder="Наименование контрольной точки"
               className={classNames({"p-invalid": submitted && !checklistItem.values.name})}
               value={checklistItem.values.name}
               onChange={(e) => checklistItem.setFieldValue('name', e.target.value)} required autoFocus type="text" tooltip="Наименование контрольной точки" maxLength={50}/>
         </div>
         <div className="field col-6">
            <label htmlFor="end_point">Дата контрольной точки</label>
            <Calendar id="end_point" className={classNames({"p-invalid": submitted && !checklistItem.values.end_point})} value={checklistItem.values.end_point ? new Date(checklistItem.values.end_point) : null} onChange={(e) => checklistItem.setFieldValue('end_point', e.target.value)} dateFormat="dd MM yy" locale="ru" showIcon required  showButtonBar tooltip="Дата контрольной точки"/>
         </div>
         <div className="field col-6">
            <label htmlFor="is_closed" className="mr-3 mb-3">Точка завершена</label>
            <div>
               <InputSwitch checked={checklistItem.values.is_closed} onChange={(e) => checklistItem.setFieldValue('is_closed', e.value)} tooltip="Установите если точка завершена"/>
            </div>
         </div>
      </div>
   )

   const card = (
      <React.Fragment>
         {editorType === cardType.checkList ? checklistCard : ''}         
         {editorType === cardType.section ? sectionCard : ''}         
         {editorType === cardType.item ? itemCard : ''}         
      </React.Fragment>
   )
//#endregion

//#region //******************************* Control Templates *********************************//
   const leftButton = (
      <React.Fragment>
         <Button icon="pi pi-plus" rounded severity="success" aria-label="Создать"
            tooltip="Создать" tooltipOptions={{ position: 'top' }}
            visible={!checkList}
            onClick={() => createCheckList()}
            type="button" 
         />
         <Button icon="pi pi-pencil" className="itr-row-button" rounded severity="info" aria-label="Редактировать"
            tooltip="Редактировать" tooltipOptions={{ position: 'top' }}
            visible={!!checkList}
            onClick={() => updateCheckList(checkList)}
            type="button"
         />
         <Button className="itr-row-button ext-button" rounded severity="success" aria-label="Редактировать"
            tooltip="Добавить этап" tooltipOptions={{ position: 'top' }}
            visible={!!checkList}
            onClick={() => createSection()}
            type="button">
            <AddButton/>
         </Button>
      </React.Fragment>
   );

   const rightButton = (
      <React.Fragment>
         <Button icon="pi pi-trash" rounded severity="danger" aria-label="Удалить"
            tooltip="Удалить" tooltipOptions={{ position: 'top' }}
            visible={!!checkList}
            onClick={() => deleteCheckList(checkList?.id)}
            type="button"
         />
      </React.Fragment>
   );

   const sectionTemplate = (node: TreeNode, options: TreeNodeTemplateOptions | undefined) => {
      return <div key={node.key} className="phase-row w-full">               
               {
                  readOnly?
                  <Button className="button-cell" icon="pi pi-eye" rounded severity="info" aria-label="Просмотреть"
                     tooltip="Просмотреть этап" tooltipOptions={{ position: 'top' }}
                     onClick={() => viewSection(node)}
                     type="button"
                  />:
                  <Button className="button-cell" icon="pi pi-pencil" rounded severity="info" aria-label="Редактировать"
                     tooltip="Редактировать этап" tooltipOptions={{ position: 'top' }}
                     onClick={() => updateSection(node)}
                     type="button"
                  />
               }
               <Button className={classNames("button-cell ext-button", readOnly?'form-disabled':'')} rounded severity="success" aria-label="Создать"
                  tooltip="Добавить контрольную точку" tooltipOptions={{ position: 'top' }}
                  onClick={() => createItem(node)}
                  type="button">
                  <AddButton/>
               </Button>
               <div>
                  {node.label}
               </div>
               <Button className={classNames("button-cell", readOnly?'form-disabled':'')} icon="pi pi-trash" rounded severity="danger" aria-label="Удалить"
                  tooltip="Удалить этап" tooltipOptions={{ position: 'top' }}
                  onClick={() => deleteSection(node)}
                  type="button"
               />
            </div>;
   }

   const itemTemplate = (node: TreeNode, options: TreeNodeTemplateOptions | undefined) => {
      return <div className="item-row w-full">
               {readOnly ?
               <Button className="item-cell" icon="pi pi-eye" rounded severity="info" aria-label="Просмотреть"
                  tooltip="Просмотреть контрольную точку" tooltipOptions={{ position: 'top' }}
                  onClick={() => viewItem(node)}
                  type="button"
               /> :
               <Button className="item-cell" icon="pi pi-pencil" rounded severity="info" aria-label="Редактировать"
                  tooltip="Редактировать контрольную точку" tooltipOptions={{ position: 'top' }}
                  onClick={() => updateItem(node)}
                  type="button"
               />}
               <div className="item-text">{node.data.name}</div>
               <div className="item-cell">{new Date(node.data.end_point??'').toLocaleDateString("ru-RU")}</div>
               <InputSwitch className="item-cell" checked={node.data.is_closed??false} />               
               <Button icon="pi pi-trash" className={classNames("item-cell", readOnly?'form-disabled':'')} rounded severity="danger" aria-label="Удалить"
                  tooltip="Удалить контрольную точку" tooltipOptions={{ position: 'top' }}
                  onClick={() => deleteItem(node)}
                  type="button"/>
            </div>
   }

   const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions | undefined) => {
      return node.children !== undefined ? sectionTemplate(node, options) : itemTemplate(node, options);
   }

   const checkListName = (
      <React.Fragment>
         <div className="grid">
            <div className="col-1"></div>
            <div className="col-10">
               <h5 hidden={!checkList} className="font-light font-italic text-center m-0">{checkList?.name}</h5>
               <h6 hidden={!checkList} className="font-light text-cyan-500 text-center m-0">{checkList?.division?.name}</h6>
            </div>
            <div className="col-1"></div>
         </div>
      </React.Fragment>
   );
//#endregion

   return (
      <React.Fragment>
         <div className="col-12">
               <h5 className="font-light">Чек-лист</h5>
               <Toolbar start={!readOnly?leftButton:null} center={checkListName} end={!readOnly?rightButton:null}/>
               <Tree 
                  expandedKeys={expanded}
                  onToggle={(e) => setExpanded(e.value)}
                  className="w-full" 
                  value={nodes} 
                  nodeTemplate={nodeTemplate}
               />
               <div className="col-12 relative">                  
                  <div className="absolute right-0 pr-1">
                  <Button icon="pi pi-replay" 
                     rounded
                     text
                     aria-label="Обновить"
                     tooltip="Обновить" tooltipOptions={{ position: 'top' }}
                     onClick={() => {
                        readCheckListData(id).then((data) => setNodes(convertToTreeData(data?.sections)));
                     }}
                  />
                  </div>
               </div>
         </div>
         <ItrCard
            header={cardHeader}
            width={'50vw'}
            save={save}
            body={card}
            hiddenSave={readOnly}
            ref={editor}
         />
         <ConfirmDialog />
         <Toast ref={toast} />
      </React.Fragment>
   );
};

export default CheckListControl;
