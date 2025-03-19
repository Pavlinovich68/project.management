'use client'
import React, {useRef, useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import { IRoadmapFactItem } from "@/models/IRoadmapFactItem";

const ItrItemInWork = ({params}: {params: IRoadmapFactItem}) => {
   return (
      <div>
         {params.project_name}
      </div>
   );
};

export default ItrItemInWork;
