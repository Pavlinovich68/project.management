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

   static withoutTimeExt = (year: number, month: number, day: number) => {
      const xDate = new Date(year, month, day);
      return xDate.toLocaleDateString('fr-CA');
   }
}