import { BaseEntity } from "./BaseEntity";

export interface Employee {
   id?: number | undefined | null,
   first_name: string,
   last_name: string,
   patronymic: string,
   post_id?: number,
   division?: BaseEntity | undefined | null,
   begin_date: Date,
   end_date?: Date | undefined | null,
}