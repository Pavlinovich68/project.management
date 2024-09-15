import { IBaseEntity } from "./IBaseEntity";

export interface IStaff {
   id: number | undefined;
   rate: IStaffRate | undefined;
   employee: IBaseEntity | undefined;
}

export interface IStaffRate {
   id: number | undefined;
   no: number | undefined;
   name: string | undefined;
}