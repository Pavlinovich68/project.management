export interface IRoadmapData {
   id: number,
   name: string | undefined,
   project_id: number,   
   project_name: string | undefined,
   width: number | undefined,
   height: number | undefined,
   segments: IRoadmapSegment[]
}

export interface IRoadmapSegment {
   title: string | undefined,
   value: number,
   color: string,
   percent: number | undefined
}