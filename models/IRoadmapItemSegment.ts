export interface IRoadmapItemSegment {
   id: number,
   name: string | null,
   start: number,
   end: number,
   value: number | undefined,
   type: number,
   percent: number | undefined,
   hours: number | undefined,
   fact: IRoadmapFactItemSegment | undefined
   points: IControlPoint[] | undefined
}

export interface IRoadmapFactItemSegment {
   percent: number | undefined,
   hours: number | undefined
}

export interface IControlPoint {
   name: string | undefined | null,
   date: Date | undefined | null,
   value: number | undefined | null
}