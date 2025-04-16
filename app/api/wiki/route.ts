import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
   try {
      const res = await fetch(`http://localhost:8080/graphql`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.WIKI_TOKEN}`
         },
         body: JSON.stringify({
            query: `
               {
                  pages {
                     single (id: ${process.env.WIKI_PAGE}) {
                        path
                        title
                        content
                        createdAt
                        updatedAt
                     }
                  }
               }`
         })
      });
      const result = await res.json();
      
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: (error as Error).stack });
   }
}