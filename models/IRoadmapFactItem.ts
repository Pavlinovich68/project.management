export interface IRoadmapFactItem {
   id: number | undefined
   uuid: string | undefined
   year: number
   month: number
   day: number
   note: string | undefined
   work_type: number | undefined
   roadmap_item_id: number | undefined
   hours: number | undefined
   project_id: number | undefined
   employee_id: number | undefined
   project_name: string | undefined | undefined
   is_deleted: boolean
}