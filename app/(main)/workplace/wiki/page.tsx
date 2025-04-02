'use client'
import React, {useRef, useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import MarkdownPreview from '@uiw/react-markdown-preview';

const Wiki = () => {
   const {data: session} = useSession();
   const [content, setContent] = useState<string>('');

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
      return data.data.data.pages.single.content;
   }

   return (
      session ?
      <MarkdownPreview source={content} style={{ padding: 16 }} /> : <React.Fragment></React.Fragment>
   );
};

export default Wiki;
