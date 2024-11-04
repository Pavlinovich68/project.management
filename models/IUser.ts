import {IDivision} from "@/models/IDivision";

export interface IUser {
   id?: number,
   email?: string,
   division?: IDivision,
   division_id?: number,
   contacts?: string,
   roles: any,
   attachment_id?: number | undefined | null,
   employee?: {
      id: number,
      name: string,
      email: string,
      begin_date: Date,
      end_date: Date | undefined | null
   }
}