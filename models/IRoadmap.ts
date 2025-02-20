import { IBaseEntity } from "./IBaseEntity"

export interface IRoadmap {
   id?: number | undefined | null
   project?: IBaseEntity | undefined | null,
   comment: string | undefined | null,
   plan_hours: number | undefined | null
}