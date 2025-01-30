import prisma from "@/prisma/client";

const MILLISECONDS = 1000 * 60 * 60 * 24;
export default class DateHelper {
   
   static formatDate = (date?: Date | null | undefined) => {
      if (!date || date === undefined) {
         return '';
      }
      return new Date(date).toLocaleDateString('ru-RU', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
      });
   };

   static formatDateWithoutYear = (date?: Date | null | undefined) => {
      if (!date || date === undefined) {
         return '';
      }
      return new Date(date).toLocaleDateString('ru-RU', {
         day: '2-digit',
         month: 'long'
      });
   };

   static createDate = (date: string | null | undefined) => {
      if (!date || date === undefined) {
         return null;
      }
      return new Date(date);
   }

   static fromString = (date: string | null | undefined) => {
      if (!date || date === undefined) {
         return null;
      }
      const parts = date.split('.');
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
   }

   static withoutTime = (date: string | null | undefined) => {
      if (!date) {
         return undefined;
      }
      const _date = new Date(date);
      const year = _date.getFullYear();
      const month = _date.getMonth();
      const day = _date.getDate();
      const xDate = new Date(year, month, day);
      return xDate.toLocaleDateString('fr-CA');
   }

   static currentLocaleDate = (date: Date): Date => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return new Date(year, month, day);
   }

   static withoutTimeExt = (year: number, month: number, day: number) => {
      const xDate = new Date(year, month, day);
      return xDate.toLocaleDateString('fr-CA');
   }

   static addDays = (date: Date, days: number): Date => {
      var _date = new Date(date.valueOf());
      _date.setDate(_date.getDate() + days);
      return _date;
   }

   static daysBetween = (startDate: Date, endDate: Date) => {
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
         throw new Error('Применяйте корректные объекты Date.');
      }      
      
      const diffTime = Math.abs(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
         Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
      const diffDays = Math.round(diffTime / MILLISECONDS);
      
      return diffDays;
   }

   static dayNumber = (date: Date): number => {
      let result = 0;
      const month = date.getMonth();
      for (let i = 0; i <= 11; i++){
         if (month === i) {
            result = result + date.getDate();
            break;
         }
         result = result + new Date(date.getFullYear(), i+1, 0).getDate();
      }
      return result;
   }
}