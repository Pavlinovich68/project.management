import { IBaseEntity } from "./IBaseEntity"

export interface IProject {
   id?: number | undefined | null,
   code: string,
   name: string,
   division: IBaseEntity | undefined,
   begin_date: Date | undefined,
   end_date?: Date | undefined | null
}