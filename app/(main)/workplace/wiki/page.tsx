'use client'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Wiki = () => {
   const {data: session, status} = useSession();
   const [content, setContent] = useState<string>('');

   const spiner = (
      <i className="pi pi-spin pi-spinner flex align-items-center justify-content-center" style={{ fontSize: '10rem', color: '#326fd1'}}></i>
   )

   useEffect(() => {
      readWiki().then((str) => {
         console.log(str);
         setContent(str)
      });
   }, [])

   const readWiki = async () => {
      const res = await fetch(`/api/wiki`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         }
      });
      const data = await res.json();
      return data.result.content;
   }

   if (status === 'loading') return spiner;
   if (!session) return <React.Fragment></React.Fragment>;

   return (
      <MarkdownPreview source={content} style={{ padding: 16, width: '100%' }} />
   );
};

export default Wiki;
