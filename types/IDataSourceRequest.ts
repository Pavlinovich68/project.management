import { AggregateField } from "@/models/AggregateField";

export interface IDataSourceRequest {
   showClosed: boolean,
   pageSize: number,
   pageNo: number,
   orderBy?: any,
   searchStr?: any,
   aggregates?: AggregateField[] | undefined
}