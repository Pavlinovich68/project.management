'use client'
import { classNames } from "primereact/utils";
import React, {useRef, useState, useEffect} from "react";
//import styles from "./styles.module.scss"
import ItrYearSwitsh from "@/components/ItrYearSwitch";
import ItrRoadmap from "@/components/roadmap/ItrRoadmap";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { IRoadmapItemCRUD } from "@/models/IRoadmapItem";
import { Toast } from "primereact/toast";
import { ICardRef } from "@/models/ICardRef";
import RecordState from "@/models/enums/record-state";

const Roadmap = () => {
   const controllerName = 'roadmap';
   const model: IRoadmapItemCRUD = {id: undefined, comment: undefined, roadmap_id: undefined, project_id: undefined,
      project_name: undefined, start_date: undefined, hours: undefined, developer_qnty: undefined
   };
   const toast = useRef<Toast>(null);
   const editor = useRef<ICardRef>(null);
   const [cardHeader, setCardHeader] = useState('');
   const [recordState, setRecordState] = useState<RecordState>(RecordState.ready);
   const [submitted, setSubmitted] = useState(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [year, setYear] = useState<number>(new Date().getFullYear());
   const {data: session} = useSession();

   useEffect(() => {
      changeYear(year);      
   }, []);

   const changeYear = (val: number) => {
      setYear(val);
   }
   
   if (!session) return;

   const startContent = (
         <React.Fragment>
            <Button icon="pi pi-plus" className="mr-2" />
         </React.Fragment>
   );

   //#region //SECTION CARD
const employee = useFormik<IEmployee>({
   initialValues: model,
   validate: (data) => {
      let errors: FormikErrors<IEmployee> = {};
      if (!data.name){
         errors.name = "ФИО должно быть заполнено!";
      }
      if (!data.email){
         errors.email = "Адрес электронной почты должен быть указан!";
      }
      if (!data.begin_date){
         errors.begin_date = "Дата начала действия должна быть заполнена!";
      }
      return errors;
   },
   onSubmit: () => {
      employee.resetForm();
   }
});

const card = (
   <div className="card p-fluid">
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1', zIndex: "1000", position: "absolute", left: "calc(50% - 5rem)", top: "calc(50% - 5rem)", display: `${isLoading ? 'block' : 'none'}`}} hidden={!isLoading}></i>
      <div className="p-fluid formgrid grid">         
      </div>
   </div>
)
//#endregion //!SECTION CARD

//#region //SECTION CRUD   

   return (
      <div className="grid">
         <div className="col-12">
            <div className="card" style={{position: "relative"}}>
               <h3>Дорожная карта по реализации проектов</h3>
               <ItrYearSwitsh year={year} onChange={changeYear}/>
               <Toolbar start={startContent} style={{marginTop: "1rem"}}/>
               <ItrRoadmap year={year} division_id={session.user.division_id} card={card} cardHeader={cardHeader} editor={editor}/>               
            </div>
         </div>
      </div>
   );
};

export default Roadmap;
