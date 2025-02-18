export interface IDashboardProjectItem {
   dashboard_id: number,
   dashboard_item_id: number,   
   comment: string,
   project_code: string,
   project_name: string,
   hours: number,
   start_width: number | undefined,
   plan_width: number | undefined,
   fact_hours: number | undefined | null,
   fact_width: number | undefined | null,
   is_closed: boolean,
   percentage: number,
   control_points: IDashboardControlPoint[]
}

export interface IDashboardControlPoint {
   id: number | undefined | null,
   name: string | undefined | null,
   date: Date | undefined | null,
   width: number | undefined | null,
   type: number | undefined | null
}