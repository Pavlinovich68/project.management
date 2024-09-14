/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import {useSession} from "next-auth/react";
import { MenuProvider } from './context/menucontext';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { IconBooks, IconUsers, IconCube } from '@tabler/icons-react';
import { IconCalendarWeek, IconCalendarCog, IconBeach, IconArmchair, IconListCheck, IconUsersGroup,
   IconStar, IconListDetails, IconStars } from '@tabler/icons-react';

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
         visible: checkRoles(['developer', 'read_only']),
         items: [
            {
               label: 'Администрирование',
               icon: 'pi pi-fw pi-cog',
               tabler: <IconAdjustmentsHorizontal className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['developer']),
               items: [
                  {
                     label: 'Пользователи',
                     visible: checkRoles(['developer']),
                     icon: 'pi pi-fw pi-user',
                     to: '/workplace/admin/users',
                     tabler: <IconUsers className='mr-1' stroke={1.5}/>
                  }
               ]
            },
            {
               label: 'Моё подразделение',
               tabler: <IconStar  className='mr-1' stroke={1.5}/>,
               //tabler: <IconUsersGroup className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['developer', 'master']),
               items: [                  
                  {
                     label: 'Ставки',
                     tabler: <IconListCheck className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/department/rate',               
                  },               
                  {
                     label: 'Штатные единицы',
                     tabler: <IconStars className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/department/staff',               
                  },
                  {
                     label: 'График отпусков',
                     tabler: <IconBeach className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/department/vacations',               
                  },
                  {
                     label: 'Рабочий календарь',
                     tabler: <IconCalendarWeek className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/department/calendar',               
                  },
               ]
            },
            {
               label: 'Справочники',
               icon: 'pi pi-fw pi-book',
               tabler: <IconBooks className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['master']),
               items: [
                  {
                     label: 'Подразделения',
                     icon: 'pi pi-fw pi-building',
                     to: '/workplace/references/divisions'
                  },
                  {
                     label: 'Должности',
                     tabler: <IconArmchair className='mr-1' stroke={1.5}/>,
                     to: '/workplace/references/post',               
                  },
                  {
                     label: 'Проекты',
                     tabler: <IconListDetails className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/references/projects'
                  },
                  {
                     label: 'Производственный календарь',
                     tabler: <IconCalendarCog className='mr-1' stroke={1.5}/>,
                     to: '/workplace/references/calendar'
                  },
                  {
                     label: 'Сотрудники организации',
                     tabler: <IconUsersGroup className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/references/employee'
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
