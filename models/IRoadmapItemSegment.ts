export interface IRoadmapItemSegment {
   id: number,
   name: string | null,
   start: number,
   end: number,
   type: number,
   percent: number | undefined,
   color: string | void
}