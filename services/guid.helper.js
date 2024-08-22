export default class GuidHelper {
   static newGuid = () => {
      var guid = "";
      for (var i = 0; i < 32; i++) {
         guid += (i === 8 || i === 12 || i === 16 || i === 20) ? "-" : Math.floor(Math.random() * 16).toString(16);
      }
      return guid;
   };
}