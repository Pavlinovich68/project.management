'use client'
import { IProject } from "@/models/IProject";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import styles from "./styles.module.scss";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ListBox } from "primereact/listbox";

const ItrItemInWork = ({params, dropdownList}: {params: IRoadmapFactItem, dropdownList: IProject[]}) => {
   const [item, setItem] = useState<IRoadmapFactItem>(params)

   const countryOptionTemplate = (option: IProject) => {
      return (
         <div className="flex align-items-center">
            <div>{option.code}</div>
            <div>{option.name}</div>
         </div>
      );
   };

   return (
      <div className={classNames(styles.workGridItem)}>
         <div className={classNames(styles.project)}>            
            <small style={{color:"#7F8B9B"}}>Проект</small>
            <Dropdown className={classNames(styles.dropdown)} options={dropdownList} optionLabel="name" optionValue="id" value={params.project_id}/>
         </div>
         <small style={{color:"#7F8B9B"}}>Выполненные работы</small>
         <div className={classNames(styles.workValue)}>
            <InputText className={classNames(styles.projectNote)} keyfilter="int" placeholder="Выполненные работы" value={item.note} />
            <InputNumber className={classNames(styles.ratio)} value={item.ratio}/>
         </div>         
      </div>      
   );
};

export default ItrItemInWork;
