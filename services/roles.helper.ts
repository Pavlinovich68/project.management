import { IDictionary } from "@/types/IDictionary";

export default class RolesHelper {
   static roles = ():Record<string, string>[] => {
      return [
         {'admin': 'Администратор'},
         {'boss': 'Руководитель'},
         {'master': 'Начальник отдела'},
         {'developer': 'Разработчик'},
         {'analyst': 'Аналитик'},
         {'tester': 'Тестировщик'},
         {'reader': 'Только чтение'},
      ];
   }
   static checkRoles = (listRoles: IDictionary | undefined, searchRoles: string[]) => {
      if (!listRoles || !searchRoles) {
         return false;
      }
      const roles = Object.keys(listRoles);
      const intersection = searchRoles.filter(x => roles.includes(x));
      return intersection.length > 0
   }
}