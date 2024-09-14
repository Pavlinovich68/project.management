import { IBaseEntity } from "./IBaseEntity"

export interface IRate {
   id?: number | undefined | null,
   no: number,
   division: IBaseEntity | undefined,
   post: IBaseEntity | undefined,
}