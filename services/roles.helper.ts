import { IDictionary } from "@/types/IDictionary";

export default class RolesHelper {
   static checkRoles = (listRoles: IDictionary | undefined, searchRoles: string[]) => {
      if (!listRoles || !searchRoles) {
         return false;
      }
      const roles = Object.keys(listRoles);
      const intersection = searchRoles.filter(x => roles.includes(x));
      return intersection.length > 0
   }
}