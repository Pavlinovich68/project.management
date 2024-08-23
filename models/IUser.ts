import {IDivision} from "@/models/IDivision";

export interface IUser {
   id?: number,
   email?: string,
   division?: IDivision,
   division_id?: number,
   name: string,
   contacts?: string,
   begin_date: Date,
   end_date?: Date | undefined | null,
   roles: any,
   attachment_id?: number | undefined | null
}