'use client'
import React, {useRef, useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";
import { classNames } from "primereact/utils";
import { Fieldset } from "primereact/fieldset";

const ItrItemInWork = ({params}: {params: IRoadmapFactItem}) => {
   return (
      <p>
         {params.project_name}
      </p>
   );
};

export default ItrItemInWork;
