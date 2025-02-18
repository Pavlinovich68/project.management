import { IDashboardControlPoint } from "./IDashboardProjectItem";

export interface IDashboardItem {
   dashboard_id: number,
   id: number,
   project_id: number,
   project_code: string,
   project_name: string
}

export interface IDashboardItemCRUD {
   id: number,
   comment: string,
   dashboard_id: number,
   project_id: number,
   project_name: string | undefined | null,
   hours: number,
   is_closed: boolean,
   control_points: IDashboardControlPoint[]
}

export interface IDashboardItemsCollection {
   dashboard_id: number;
   items: IDashboardItem[];
}