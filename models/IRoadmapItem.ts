import { IRoadmapControlPoint } from "./IRoadmapProjectItem";

export interface IRoadmapItem {
   roadmap_id: number,
   id: number,
   project_id: number,
   project_code: string,
   project_name: string
}

export interface IRoadmapItemCRUD {
   id: number,
   comment: string,
   roadmap_id: number,
   project_id: number,
   project_name: string | undefined | null,
   hours: number,
   is_closed: boolean,
   control_points: IRoadmapControlPoint[]
}

export interface IRoadmapItemsCollection {
   roadmap_id: number;
   items: IRoadmapItem[];
}