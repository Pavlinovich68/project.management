export default class ArrayHelper {
   static paginate = <Type>(array: Type[], pageSize: number, pageNo: number): Type[] => {
      return array.slice((pageNo -1) * pageSize, pageNo * pageSize);
   };

   static remove = <Type>(array: Type[], value: Type): Type[] => {
      const index = array.indexOf(value);
      if (index > -1) {
         array.splice(index, 1);
      }
      return array;
   }
}