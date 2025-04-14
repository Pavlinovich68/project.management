'use client'
import { IBaseEntity } from "@/models/IBaseEntity";
import { IInProgressReport } from "@/models/IInProgressReport";
import { useSession } from "next-auth/react";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React, { useState } from "react";

const ItrInProgressItem = ({elem, projects}:{elem: IInProgressReport, projects: IBaseEntity[] | undefined}) => {
   const [progressItem, setProgressItem] = useState<IInProgressReport>(elem)
   console.log(elem);
   return (
      <div className="col-12" key={progressItem.id}>
         <Dropdown
            value={progressItem.project.id} 
            required 
            optionLabel="name" 
            optionValue="id" 
            filter
            options={projects}
            onChange={(e) => {
               const item = projects?.find(i => i.id === e.value);
               if (item && item.id && item.name) {
                  let _progressItem = progressItem;
                  _progressItem.project.id = item.id;
                  _progressItem.project.name = item.name;
                  setProgressItem(_progressItem);
               }
            }}
         />
      </div>
   );
};

export default ItrInProgressItem;
