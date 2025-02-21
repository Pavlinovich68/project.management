import { IBaseEntity } from "@/models/IBaseEntity"

export interface IRoadmapItem {
   id: number
   comment: string | undefined
   roadmap_id: number
   project: IBaseEntity
   hours: number
   is_closed: boolean
}