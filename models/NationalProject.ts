import { BaseEntity } from "./BaseEntity";
import { IDirection } from "./IDirection";

export interface NationalProject {
   id?: number | undefined | null,
   code: string,
   name: string,
   short_name: string,
   is_priority: boolean,
   direction?: IDirection | null,
   curator?: BaseEntity | undefined,
   owner?: BaseEntity | undefined,
   administrator?: BaseEntity | undefined,
   responsible?: BaseEntity | undefined,
   specialist?: BaseEntity | undefined,
   begin_date: Date,
   end_date?: Date | undefined | null,
}