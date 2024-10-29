export interface IRoadmapItemSegment {
   id: number,
   name: string | null,
   start_date: Date,
   end_date: Date,
   width: string | undefined,
   height: string | null,
   value: number | undefined,
   color: string | undefined,
   percent: number | undefined
}