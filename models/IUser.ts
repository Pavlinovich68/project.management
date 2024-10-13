import {IDivision} from "@/models/IDivision";

export interface IUser {
   id?: number,
   email?: string,
   begin_date?: Date | undefined | null,
   end_date?: Date | undefined | null,
   division?: IDivision,
   division_id?: number,
   contacts?: string,
   roles: any,
   attachment_id?: number | undefined | null
}