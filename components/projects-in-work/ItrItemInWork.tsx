'use client'
import { IProject } from "@/models/IProject";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import styles from "./styles.module.scss";
import { useState } from "react";

const ItrItemInWork = ({params, dropdownList}: {params: IRoadmapFactItem, dropdownList: IProject[]}) => {
   const [item, setItem] = useState<IRoadmapFactItem>(params)

   const countryOptionTemplate = (option: IProject) => {
      return (
         <div className={classNames(styles.dropdownItemTemplate)}>
            <div className={classNames(styles.projectName)}>{option.name}</div>
         </div>
      );
   };

   return (
      <div className={classNames(styles.workGridItem)}>
         <Dropdown
            value={item.project_id}
            className={classNames('project-in-work', styles.projectDropdown)}
            options={dropdownList}
            optionValue="id"
            optionLabel="name"
            placeholder="Выберите проект"
            itemTemplate={countryOptionTemplate}
            onChange={(e) => {
               const _item = dropdownList?.find(i => i.id === e.value);
               if (_item && _item.id) {
                  setItem({...item, project_id: _item.id, project_name: _item.name});
               }
            }}
            filter
         />
      </div>      
   );
};

export default ItrItemInWork;
