import { IRoadmapItemCRUD } from "./IRoadmapItem"

export interface IRoadmapRowSegmentData {
   segments: IRoadmapItemSegment[],
   points: IControlPoint[],
   items: IRoadmapItemCRUD[]
}

export interface  IRoadmapItemSegment {
   id: number,
   name: string | null,
   start: number,
   end: number,
   value: number | undefined,
   type: number,
   percent: number | undefined,
   hours: number | undefined,
   fact: IRoadmapFactItemSegment | undefined
}

export interface IRoadmapFactItemSegment {
   percent: number | undefined,
   hours: number | undefined
}

export interface IControlPoint {
   id: number | undefined | null,
   item_id: number | undefined | null,
   name: string | undefined | null,
   date: Date | undefined | null,
   value: number | undefined | null,
   type: number | undefined | null
}