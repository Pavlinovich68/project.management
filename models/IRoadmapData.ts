export interface IRoadmapData {
   length: number,
   data: IRoadmapDataItem[]
}

export interface IRoadmapDataItem {
   comment: string | undefined
   begin_date: Date,
   hours: number,
   start: number
}