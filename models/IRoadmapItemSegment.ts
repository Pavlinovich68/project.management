export interface IRoadmapItemSegment {
   id: number,
   name: string | null,
   start: number,
   end: number,
   value: number | undefined,
   type: number,
   percent: number | undefined,
   hours: number | undefined,
   color: string
}