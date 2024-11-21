export interface IDataSourceResult {
   recordCount: number;
   pageCount: number;
   pageNo: number;
   pageSize: number;
   result: any[];
   aggregation: any;
}