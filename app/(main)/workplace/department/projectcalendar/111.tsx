'use client'
import React, {useRef, useState, useEffect} from "react";
import { useSession } from "next-auth/react";

const Aaa = () => {
   const {data: session, status} = useSession();

   const spiner = (
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '10rem', color: '#326fd1'}}></i>
   )

   if (status === 'loading') return spiner;
   if (!session) return <React.Fragment></React.Fragment>;
   return (
      <div className="grid">
         <div className="col-12">
            <div className="card">
            </div>
         </div>
      </div>
   );
};

export default Aaa;
