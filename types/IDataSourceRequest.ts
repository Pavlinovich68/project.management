import { IAggregateField } from "@/models/IAggregateField";

export interface IDataSourceRequest {
   id: number | undefined | null,
   showClosed: boolean,
   pageSize: number,
   pageNo: number,
   orderBy?: any,
   searchStr?: any,
   aggregates?: IAggregateField[] | undefined
}