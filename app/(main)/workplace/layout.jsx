'use client'
import Layout from '@/layout/layout';
import {addLocale} from 'primereact/api';
export default function WorkplaceLayout({ children }) {
   addLocale('ru', {
      firstDayOfWeek: 1,
      dayNames: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
      dayNamesShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
      dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
      monthNamesShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      today: 'Сегодня',
      clear: 'Очистить'
   });
   return (
         <Layout>{children}</Layout>
   );
}