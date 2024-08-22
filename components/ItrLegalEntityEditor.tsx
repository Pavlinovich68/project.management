'use client'
import { IBaseLegalEntity } from "@/models/IBaseLegalEntity";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, {useRef, useState, useEffect, EventHandler, ChangeEvent} from "react";

const LegalEntityEditor = ({label, readOnly, innValue, nameValue, onClean, onSearch}: {label: string, readOnly: boolean, innValue: string | undefined, nameValue: string | undefined, onClean: React.MouseEventHandler<HTMLButtonElement> | undefined, onSearch: React.EventHandler<any> | undefined}) => {

   const onInnerSearch = () => {
      //TODO - Сделать получение информации по организации из ЕГРЮЛ
      const result: IBaseLegalEntity = {
         id: 100,
         inn: '123213124124',
         name: 'ООО "Рога и Копыта"'
      }
      //@ts-ignore
      onSearch(result);
   }
   return (
      <div className="legal-entity">
         <label>{label}</label>
         <div className="le-input">         
            <InputText
               className="inn-input"
               value={innValue}
               onChange={(e) => innValue = e.target.value} required type="text"/>
            <Button icon="pi pi-search" security="secondary" type="button" onClick={onInnerSearch} disabled={readOnly}/>
            <Button icon="pi pi-times" severity="danger"  type="button" onClick={onClean} disabled={readOnly}/>
            <InputText 
               readOnly
               tooltip={nameValue}
               className="name-input"
               value={nameValue}            
               onChange={(e) => nameValue = e.target.value} required type="text"/>
         </div>
      </div>      
   );
};

export default LegalEntityEditor;
