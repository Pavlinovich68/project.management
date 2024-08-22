import {DataTableSortMeta} from "primereact/datatable";

class GridTools{
   cleanOrders = (id: string) => {
      let grid = document.getElementById(id);
      if (grid){
         let columns = grid.querySelectorAll('.p-sortable-column');
         columns.forEach((col) => {
            let span = col.querySelector('span[data-pc-section="sort"]');
            if (span) {
               span.innerHTML = '';
               span.classList.remove('pi', 'pi-fw', 'pi-sort-alt');
            }
         });
      }
   }

   sortOrders = (id: string, columnFields: string[], prevSort: DataTableSortMeta[]) => {
      let grid = document.getElementById(id);
      if (grid){
         let columns = grid.querySelectorAll('.p-sortable-column');
         let idx = 0;
         columns.forEach((col, index)=>{
            let $field = columnFields[index];
            let $order = prevSort.find(itm => itm.field === $field);
            let span = col.querySelector('span[data-pc-section="sort"]');
            if (span){
               span.classList.remove('pi', 'pi-fw', 'pi-sort-alt');
               if ($order) {
                  idx++;
                  if ($order.order == 1){
                     span.innerHTML = `<i class="pi pi-angle-down"><sup class="sort-order">${prevSort.length > 1 ? idx : ''}</sup></i>`;
                  } else {
                     span.innerHTML = `<i class="pi pi-angle-up"><sup class="sort-order">${prevSort.length > 1 ? idx : ''}</sup></i>`;
                  }
               } else {
                  span.innerHTML = '';
               }
            }
         });
      }
   }
}

export default new GridTools();