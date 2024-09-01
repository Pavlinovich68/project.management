import { Nullable } from "primereact/ts-helpers";

export interface IProductionCalendar {
   id?: number | undefined | null,
   calendar_id?: number | undefined | null,
   date?: Date | undefined,
   exclusion_type?: number | undefined | null,
   exclusion_type_name?: string | undefined | null,
}