/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import {useSession} from "next-auth/react";
import { MenuProvider } from './context/menucontext';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { IconBooks, IconUsers, IconCube } from '@tabler/icons-react';

const AppMenu = () => {
   const {data: session} = useSession();      

   const checkRoles = (accessRoles) => {
      const userRoles = session?.user?.roles;
      if (!userRoles) {
         return false;
      }
      const roles = Object.keys(userRoles);
      const intersection = accessRoles.filter(x => roles.includes(x));
      return intersection.length > 0
   }

   const model = [
      {
         label: 'Меню',
         visible: checkRoles(['admin', 'read_only']),
         items: [
            {
               label: 'Администрирование',
               icon: 'pi pi-fw pi-cog',
               tabler: <IconAdjustmentsHorizontal className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['admin']),
               items: [
                  {
                     label: 'Пользователи',
                     visible: checkRoles(['admin']),
                     icon: 'pi pi-fw pi-user',
                     to: '/workplace/admin/users',
                     tabler: <IconUsers className='mr-1' stroke={1.5}/>
                  }
               ]
            },
            {
               label: 'Справочники',
               icon: 'pi pi-fw pi-book',
               tabler: <IconBooks className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['admin']),
               items: [
                  {
                     label: 'Подразделения',
                     icon: 'pi pi-fw pi-building',
                     to: '/workplace/references/divisions'
                  },
                  {
                     label: 'Проекты',
                     icon: 'pi pi-fw pi-star',
                     to: '/workplace/references/projects'
                  },
               ]
            }
         ]
      }
   ];

// TODO Меню
   return (
      <MenuProvider>
            <ul className="layout-menu">
               {model.map((item, i) => {
                  return !item?.seperator ? (<AppMenuitem item={item} root={true} index={i} key={item.label} />) : <li className="menu-separator"></li>;
               })}
            </ul>
      </MenuProvider>
   );
};

export default AppMenu;
