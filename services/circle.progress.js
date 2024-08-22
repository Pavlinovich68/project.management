export default class CircleProgress {
   static show = () => {
      let indicator = document.getElementById('circleProgressIndicator');
      if (!indicator) {
         indicator = document.createElement('div');
         indicator.id = 'circleProgressIndicator';
         indicator.className = 'circle-progress';

         let i = document.createElement('i');
         i.className = 'pi pi-spin pi-spinner';
         indicator.appendChild(i)
         document.body.appendChild(indicator);
      }
      indicator.style.display = 'block';
   }
   static hide = () => {
      const indicator = document.getElementById('circleProgressIndicator');
      if (indicator) {
         indicator.style.display = 'none';
      }
   }
}