import { IBaseEntity } from "./IBaseEntity";

export interface IStateUnit {
   id: number;
   stuff_unit_id: number | undefined;
   post: IBaseEntity | undefined,
   employee: IBaseEntity |undefined
}