'use client'
import React, {useRef, useState, useEffect} from "react";
import { DataScroller } from 'primereact/datascroller';

const ItrFileList = ({bucketName}:{bucketName: string}) => {

   const readFiles = async () => {
      const res = await fetch(`/api/minio/fileList`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      //setFiles(data.data);
   }

   return (
      <DataScroller/>
   );
};

export default ItrFileList;
