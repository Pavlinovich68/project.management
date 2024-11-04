export default class StringHelper {
   static fioTransform = (surname: string, name: string, patronymic: string) => {
      let result = surname;
      if (name)
         result = `${result} ${name?.charAt(0)}.`;
      if (patronymic)
         result = `${result} ${patronymic?.charAt(0)}.`;
      return result;
   }

   static fullNameTransform = (fio: string | undefined | null) => {
      if (!fio) return fio;
      const arr = fio.split(' ');
      return this.fioTransform(arr[0], arr[1], arr[2]);
   }
}