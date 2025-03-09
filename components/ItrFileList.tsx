'use client'
import React, {useRef, useState, useEffect} from "react";
import { DataScroller } from 'primereact/datascroller';

const ItrFileList = ({bucketName}:{bucketName: string}) => {
   return (
      <DataScroller/>
   );
};

export default ItrFileList;
