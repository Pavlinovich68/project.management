import { IBaseEntity } from "./IBaseEntity"

export interface IStuffUnit {
   id?: number | undefined | null,
   count: number,
   division: IBaseEntity | undefined,
   post: IBaseEntity | undefined,
}