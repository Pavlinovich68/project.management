import { IBaseEntity } from "@/models/IBaseEntity"

export interface IRoadmapItem {
   id: number | undefined
   comment: string | undefined | null
   roadmap_id: number | undefined
   project: IBaseEntity | undefined
   hours: number | undefined
   is_closed: boolean
}