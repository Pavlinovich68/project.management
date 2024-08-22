import { BaseEntity } from "./BaseEntity"

export interface ICantonBudget {
   id?: number | undefined | null,
   division?: BaseEntity | undefined,
   project?: BaseEntity | undefined,
   canton_plan?:  number | undefined, 
   region_plan?:  number | undefined,
   federal_plan?:  number | undefined,
   canton_fact?:  number | undefined,
   region_fact?:  number | undefined,
   federal_fact?:  number | undefined
}