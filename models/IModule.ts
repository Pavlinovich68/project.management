import { IBaseEntity } from "./IBaseEntity"

export interface IModule {
   id?: number | undefined | null,
   code: string,
   name: string,
   division: IBaseEntity | undefined,
   project: IBaseEntity |undefined
}