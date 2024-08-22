import { BaseProject } from "./BaseProject";

export interface Target {
   id?: number | undefined | null,
   name: string,
   begin_date: Date,
   end_date?: Date | undefined | null,
   project?: BaseProject
}