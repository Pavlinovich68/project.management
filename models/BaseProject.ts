export interface BaseProject {
   id?: number | undefined | null,
   code: string,
   name: string,
   short_name: string,   
   begin_date: Date,
   end_date?: Date | undefined | null
}