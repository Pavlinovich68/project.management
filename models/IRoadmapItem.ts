import { IBaseEntity } from "@/models/IBaseEntity"
import { IControlPoint } from "./IControlPoint"

export interface IRoadmapItem {
   id: number | undefined
   comment: string | undefined | null
   roadmap_id: number | undefined
   project: IBaseEntity | undefined
   hours: number | undefined
   fact: number | undefined
   plan_str: string | undefined
   fact_str: string | undefined
   is_closed: boolean
   control_points: IControlPoint[]
}