import { IBaseEntity } from "./IBaseEntity"

export interface IProject {
   id?: number | undefined | null,
   code: string,
   name: string,
   division: IBaseEntity,
   begin_date: Date,
   end_date?: Date | undefined | null
}