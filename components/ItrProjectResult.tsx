'use client'
import React, {useRef, useState, useEffect} from "react";
import ItrGrid from "./ItrGrid";
import { IBaseProjectItem } from "@/models/IBaseProjectItem";
import { ICantonResult } from "@/models/ICantonResult";
import { FormikErrors, useFormik } from "formik";
import RecordState from "@/models/enums/record-state";
import { ICardRef } from "@/models/ICardRef";
import crudHelper from "@/services/crud.helper";
import { Toast } from "primereact/toast";
import CRUD from "@/models/enums/crud-type";
import { IGridRef } from "@/models/IGridRef";
import { Column } from "primereact/column";
import trafficLight from "@/models/enums/traffic_light";
import SentimentSatisfied from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfied from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfied from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import ItrCard from "./ItrCard";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Editor, EditorTextChangeEvent } from "primereact/editor";

const ProjectResult = ({readOnly, divisionId, isCanton}: {
   readOnly: boolean,
   divisionId: number | undefined | null, 
   isCanton: boolean | undefined | null
}) => {
   const controllerName = 'canton/result';
   const emptyRecord: ICantonResult = {traffic_light: 0, desire: undefined, current: undefined, risk: undefined};
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const editor = useRef<ICardRef>(null);
   const toast = useRef<Toast>(null);
   const grid = useRef<IGridRef>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [projects, setProjects] = useState<IBaseProjectItem[]>();

const regionalProjects = async () => {
   const res = await fetch(`/api/regional_project/list`, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      }
   });
   const data = await res.json();
   setProjects(data.data);
}

   //#region //ANCHOR - Formik
const cantonResult = useFormik<ICantonResult>({
   initialValues: emptyRecord,
   validate: (data) => {
      let errors: FormikErrors<ICantonResult> = {};
      if (!data.project){
         errors.project = "Необходимо указать проект!";
      }
      return errors;
   },
   onSubmit: () => {
      cantonResult.resetForm();
   }
});
//#endregion
//#region //ANCHOR - CRUD
const createRecord = () => {
   setCardHeader('Создание новой строки');   
   regionalProjects();
   emptyRecord.division = { id: divisionId, name: '' };
   cantonResult.setValues(emptyRecord);
   setRecordState(RecordState.new);
   setSubmitted(false);
   if (editor.current) {
      editor.current.visible(true);
   }
}

const updateRecord = async (model: ICantonResult) => {
   setCardHeader('Редактирование строки');
   regionalProjects();
   cantonResult.setValues(model);
   setRecordState(RecordState.edit);
   setSubmitted(false);
   if (editor.current) {
      editor.current.visible(true);
   }
}

const viewRecord = async (model: ICantonResult) => {
   setCardHeader('Просмотр строки');
   regionalProjects();
   cantonResult.setValues(model);
   setRecordState(RecordState.ready);
   setSubmitted(false);
   if (editor.current) {
      editor.current.visible(true);
   }
}

const deleteRecord = async (model: ICantonResult) => {
   return await crudHelper.crud(controllerName, CRUD.delete, { id: model.id });
}

const saveRecord = async () => {
   setSubmitted(true);
   if (!cantonResult.isValid) {
      const errors = Object.values(cantonResult.errors);
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
      const res = await crudHelper.crud(controllerName, recordState === RecordState.new ? CRUD.create : CRUD.update, cantonResult.values);
      setIsLoading(false);

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
//#endregion
const icon = (state: trafficLight | undefined) => {
   switch (state) {
      case trafficLight.green: return  <SentimentSatisfied style={{fontSize: "48px"}} className="text-green-300"/>;
      case trafficLight.yellow: return  <SentimentDissatisfied style={{fontSize: "48px"}} className="text-yellow-300"/>;
      case trafficLight.red: return  <SentimentVeryDissatisfied style={{fontSize: "48px"}} className="text-red-300"/>;
   }
}
const sentimentTemplate = (row: ICantonResult) => {
   return (
      <div className="vertical-align-middle text-center" style={{fontSize: "48px"}}>
         {icon(row.traffic_light)}
      </div>
   );
}

const RenderHTML = ({html}:{html: string | undefined}) => (<span dangerouslySetInnerHTML={{__html:html??''}} className="html-text-doted"></span>)

const gridColumns = [
   <Column key={0} body={sentimentTemplate}/>,
   <Column key={0}  sortable header="Муниципальное образование" field="division.name"/>,
   <Column key={1}  sortable header="Региональный проект" field="project.name"/>,
   <Column key={2}  sortable header="Ожидаемый результат" body={(row) => <RenderHTML html={row.desire}/>}/>,
   <Column key={3}  sortable header="Текущий статус" body={(row) => <RenderHTML html={row.current}/>}/>,
   <Column key={4}  sortable header="Риск" body={(row) => <RenderHTML html={row.risk}/>}/>
];

//region //ANCHOR - Card
interface trafficLightOption {
   value: trafficLight
}

const trafficLightOptions: trafficLightOption[] = [
   {value: trafficLight.green},
   {value: trafficLight.yellow},
   {value: trafficLight.red}
];

const trafficLightTemplate = (option: trafficLightOption) => {
   switch (option.value) {
      case trafficLight.green: return <SentimentSatisfied/>
      case trafficLight.yellow: return <SentimentDissatisfied/>
      default: return <SentimentVeryDissatisfied/>
   }
}

const card = (
   <div className={classNames("card p-fluid", readOnly ? 'form-disabled': '')}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">
         <div className="field col-12">
            <SelectButton className="traffic-light" value={cantonResult.values.traffic_light} options={trafficLightOptions} optionLabel="value" onChange={(e) => cantonResult.setFieldValue("traffic_light", e.value)} itemTemplate={trafficLightTemplate}/>
         </div>
         <div className="field col-12">
            <label htmlFor="is_priority" className="mr-3">Национальный проект</label>
            <div>
               <Dropdown
                  value={cantonResult.values.project?.id} 
                  className={classNames({"p-invalid": submitted && !cantonResult.values.project})} 
                  required 
                  optionLabel="name" 
                  optionValue="project_id" 
                  options={projects}
                  onChange={(e) => {
                     const item = projects?.find(item => item.id === e.value);
                     if (item) {
                        cantonResult.setFieldValue('project', item);
                     }
                  }}
               />
            </div>
         </div>
         <div className="field col-12">
               <label htmlFor="desire">Ожидаемый результат</label>
               <Editor value={cantonResult.values.desire} onTextChange={(e: EditorTextChangeEvent) => cantonResult.setFieldValue('desire', e.htmlValue)} style={{ height: '100px' }} />               
            </div>
            <div className="field col-12">
               <label htmlFor="current">Текущий статус</label>
               <Editor value={cantonResult.values.current} onTextChange={(e: EditorTextChangeEvent) => cantonResult.setFieldValue('current', e.htmlValue)} style={{ height: '100px' }} />               
            </div>
            <div className="field col-12">
               <label htmlFor="risk">Риски</label>
               <Editor value={cantonResult.values.risk} onTextChange={(e: EditorTextChangeEvent) => cantonResult.setFieldValue('risk', e.htmlValue)} style={{ height: '100px' }} />               
            </div>               
      </div>
   </div>
)
//endregion

   return (
      <div className="mt-3">
         <h3 className="text-left">Результаты по региональным проектам</h3>
         <ItrGrid
            params={{division_id: divisionId, is_canton: isCanton}}
            controller={controllerName}
            create={createRecord}
            update={updateRecord}
            view={viewRecord}
            drop={deleteRecord}
            tableStyle={{ minWidth: '50rem' }}
            showClosed={false}
            columns={gridColumns}
            sortMode="multiple"            
            readOnly={readOnly}
            ref={grid}
         />
         <ItrCard
            header={cardHeader}
            width={'45vw'}
            save={saveRecord}
            body={card}
            hiddenSave={readOnly}
            ref={editor}
         />
         <Toast ref={toast} />
      </div>
   );
};

export default ProjectResult;  
