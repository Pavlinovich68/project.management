/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import {useSession} from "next-auth/react";
import { MenuProvider } from './context/menucontext';
import { IconAdjustmentsHorizontal, IconAlignLeft2, IconCalendarBolt, IconCalendarUser } from '@tabler/icons-react';
import { IconBooks, IconUsers } from '@tabler/icons-react';
import { IconCalendarWeek, IconCalendarCog, IconBeach, IconArmchair, IconListCheck, IconUsersGroup,
   IconStar, IconStars, IconStackMiddle, IconShare, IconAlignLeft, IconTower, IconChartArrows } from '@tabler/icons-react';

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
         visible: checkRoles(['admin', 'boss', 'master', 'developer', 'analyst', 'tester', 'read_only']),
         items: [
            {
               label: 'Администрирование',
               icon: 'pi pi-fw pi-cog',
               tabler: <IconAdjustmentsHorizontal className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['admin', 'master']),
               items: [
                  {
                     label: 'Пользователи',
                     visible: checkRoles(['admin', 'master']),
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
                     visible: checkRoles(['master']),
                     to: '/workplace/department/rate',               
                  },               
                  {
                     label: 'Штатные единицы',
                     tabler: <IconStars className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['master']),
                     to: '/workplace/department/staff',               
                  },
                  {
                     label: 'График отпусков',
                     tabler: <IconBeach className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['master']),
                     to: '/workplace/department/vacations',               
                  },
                  {
                     label: 'Рабочий календарь',
                     tabler: <IconCalendarWeek className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/department/calendar',               
                  },
                  {
                     label: 'Дашборд',
                     tabler: <IconChartArrows className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['master']),
                     to: '/workplace/department/roadmap',               
                  },
                  {
                     label: 'Проекты в работе',
                     tabler: <IconCalendarBolt className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/department/projectcalendar',               
                  },
               ]
            },
            {
               label: 'Справочники',
               icon: 'pi pi-fw pi-book',
               tabler: <IconBooks className='mr-1' stroke={1.5}/>,
               visible: checkRoles(['admin', 'boss', 'master', 'developer']),
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
                     tabler: <IconShare className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/references/projects'
                  },
                  {
                     label: 'Модули проектов',
                     tabler: <IconStackMiddle className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['developer', 'master']),
                     to: '/workplace/references/modules'
                  },
                  {
                     label: 'Производственный календарь',
                     tabler: <IconCalendarCog className='mr-1' stroke={1.5}/>,
                     to: '/workplace/references/calendar'
                  },
                  {
                     label: 'Сотрудники организации',
                     tabler: <IconUsersGroup className='mr-1' stroke={1.5}/>,
                     visible: checkRoles(['admin', 'boss', 'master']),
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
