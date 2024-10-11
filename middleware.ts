import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import RolesHelper from './services/roles.helper';
import { IDictionary } from './types/IDictionary';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'

export default withAuth(
   async function middleware(request: NextRequestWithAuth) {
      if (!!request.nextauth.token) {         
         const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
         
         if (request.nextUrl.pathname.match('/crud') && !RolesHelper.checkRoles(request.nextauth.token?.roles as IDictionary, 
            ['admin', 'boss', 'master', 'developer']))
         {
            //NOTE - Получение параметров запроса
            const requestParams : any  = await request.json();
            if (requestParams.operation !== 1)
               return await NextResponse.json({status: 'error', data: 'Доступ запрещен!' });
         }

         if (request.nextUrl.pathname.startsWith("/workplace") && !RolesHelper.checkRoles(request.nextauth.token?.roles as IDictionary, 
            ['admin', 'boss', 'master', 'developer'])) {
            return NextResponse.rewrite( new URL("/denided", request.url))
         }
         if (request.nextUrl.pathname.startsWith("/workplace/admin") && !RolesHelper.checkRoles(request.nextauth.token?.roles as IDictionary, 
            ['admin','master'])) {
            return NextResponse.rewrite( new URL("/denided", request.url))
         }
         if (request.nextUrl.pathname.startsWith("/users/crud") && !RolesHelper.checkRoles(request.nextauth.token?.roles as IDictionary, 
            ['admin'])) {
            return NextResponse.rewrite( new URL("/denided", request.url))
         }
         if (request.nextUrl.pathname === '/' && !RolesHelper.checkRoles(request.nextauth.token?.roles as IDictionary, 
            ['admin', 'boss', 'master', 'developer'])) {
            return NextResponse.rewrite( new URL("/denided", request.url))
         }
      }
   },
   {
      callbacks: {
         authorized: ({token, req }) => true,
      }
   }
)