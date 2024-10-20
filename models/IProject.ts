import { IBaseEntity } from "./IBaseEntity"

export interface IProject {
   id?: number | undefined | null,
   code: string,
   name: string,
   parent: IBaseEntity | undefined | null,
   parent_id: number | undefined | null
}