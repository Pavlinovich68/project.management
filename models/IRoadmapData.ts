export interface IRoadmapDataItem {
   project_code: string,
   project_name: string,
   comment: string | undefined | null,
   begin_date: Date,
   hours: number,
   left: number,
   length: number,
   end_date: Date
}