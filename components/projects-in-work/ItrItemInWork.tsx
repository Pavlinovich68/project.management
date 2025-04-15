'use client'
import { IProject } from "@/models/IProject";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import { useState } from "react";
import styles from "./styles.module.scss";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";

type ItemChangeCallback = (data: IRoadmapFactItem) => void;

const ItrItemInWork = ({params, dropdownList, onChange}: {params: IRoadmapFactItem, dropdownList: IProject[], onChange: ItemChangeCallback}) => {
   const [item, setItem] = useState<IRoadmapFactItem>(params)
   const [changed, setChanged] = useState<boolean>(false)

   const setWorkType = (t: number) => {
      let _item = {...item};
      _item.work_type = t;
      setItem(_item);
   }

   return (
      <div className={classNames(styles.workGridItem)}>
         <Tooltip target=".custom-target-icon" />         
         <div className={classNames(styles.project)}>            
            <div className={classNames(styles.itemToolbar)}>
               <small>Проект</small>
               <div 
                  className={classNames('pi pi-times custom-target-icon', styles.toolButton, styles.dropButton)}
                  data-pr-tooltip="Удалить"
                  data-pr-position="top"
                  data-pr-my="top+42 center-27"
                  onClick={()=>{
                     let _item = {...item};
                     _item.is_deleted = true;
                     setItem(_item);
                     onChange(_item);
                     setChanged(true);
                  }}
               ></div>
            </div>
            <Dropdown 
               className={classNames(styles.dropdown)} 
               options={dropdownList} 
               optionLabel="name" 
               optionValue="id" 
               value={item.project_id}
               onChange={(e) => {
                  const _item = dropdownList?.find(i => i.id === e.value);
                  if (_item && _item.id) {
                     let __item = {...item, project_id: _item.id, project_name: _item.name};
                     setItem(__item);
                     onChange(__item);
                     setChanged(true);
                  }
               }}
            />
         </div>
         <small>Выполненные работы</small>
         <div className={classNames(styles.workValue)}>
            <InputText 
               className={classNames(styles.projectNote)} 
               placeholder="Выполненные работы" 
               value={item.note}
               onChange={(e) => {
                  let _item = {...item, note: e.target.value};
                  setItem(_item);
                  onChange(_item);
                  setChanged(true);
               }}
            />
            <InputNumber 
               className={classNames(styles.ratio)} 
               value={item.hours}
               onChange={(e) => {
                  let _item = {...item, hours: e.value??0};
                  setItem(_item);
                  onChange(_item);
                  setChanged(true);
               }}
            />
         </div>
         <div className="flex flex-wrap gap-3">
            <div className="flex align-items-center">
               <RadioButton inputId="ingredient1" name="pizza" value="0" onChange={(e) => setWorkType(Number(e.value))} checked={item.work_type === 0} />
               <label htmlFor="ingredient1" className="ml-2">Разработка</label>
            </div>
            <div className="flex align-items-center">
               <RadioButton inputId="ingredient2" name="pizza" value="1" onChange={(e) => setWorkType(Number(e.value))} checked={item.work_type === 1} />
               <label htmlFor="ingredient2" className="ml-2">Техническая поддержка</label>
            </div>
            <div className="flex align-items-center">
               <RadioButton inputId="ingredient3" name="pizza" value="2" onChange={(e) => setWorkType(Number(e.value))} checked={item.work_type === 2} />
               <label htmlFor="ingredient3" className="ml-2">Прочее</label>
            </div>
         </div>
      </div>      
   );
};

export default ItrItemInWork;
