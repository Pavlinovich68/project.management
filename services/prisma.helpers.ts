class PrismaHelper {
   OR = (fields: string[], search: string) => {
      let result = [];
      for (const field of fields) {
         let elem:any = {};
         let items = field.split('.');
         if (items.length === 1) {
            elem[field] = {
               contains: search,
               mode: 'insensitive',
            };
         result.push(elem);
         } else {
            for (let i = items.length - 1; i >= 0; i--) {
               if (i === items.length - 1) {
                  elem[items[i]] = {
                     contains: search,
                     mode: 'insensitive',
                  };
               } else {
                  let innerElem:any = {};
                  innerElem[items[i]] = elem;
                  elem = innerElem;
               }
            }
            result.push(elem);
         }
      }
      return result;
   };

   inClosed = (showClosed: boolean) => {
      let result = showClosed
         ? []
         : [{ end_date: null }, { end_date: { gt: new Date() } }];
      return result;
   };
}

export default new PrismaHelper();