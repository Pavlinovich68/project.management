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
}