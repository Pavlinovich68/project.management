'use client'
import React, {useRef, useState, useEffect} from "react";
import { useSession } from "next-auth/react";
const ItrProjectsInWork = ({year, month, day, user_id}:{year: number, month: number, day: number, user_id: number}) => {
   return (
      <h3>{user_id}</h3>
   );
};

export default ItrProjectsInWork;
