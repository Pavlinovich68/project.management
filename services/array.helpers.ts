export default class ArrayHelper {
   static paginate = <Type>(array: Type[], pageSize: number, pageNo: number): Type[] => {
      return array.slice((pageNo -1) * pageSize, pageNo * pageSize);
   };

}