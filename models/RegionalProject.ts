import { BaseEntity } from "./BaseEntity";
import { NationalProject } from "./NationalProject";

export interface RegionalProject {
   id?: number | undefined | null,
   code: string,
   name: string,
   short_name: string,   
   curator?: BaseEntity | undefined,
   owner?: BaseEntity | undefined,
   administrator?: BaseEntity | undefined,
   responsible?: BaseEntity | undefined,
   specialist?: BaseEntity | undefined,
   begin_date: Date,
   end_date?: Date | undefined | null,
   project?: NationalProject
}