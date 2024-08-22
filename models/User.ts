import {Division} from "@/models/Division";

export interface User {
   id?: number,
   email?: string,
   division?: Division,
   division_id?: number,
   name: string,
   contacts?: string,
   begin_date: Date,
   end_date?: Date | undefined | null,
   roles: any,
   attachment_id?: number | undefined | null
}