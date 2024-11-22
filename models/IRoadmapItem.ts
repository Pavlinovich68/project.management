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
   start_date: Date,
   end_date: Date,
   hours: number,
   developer_qnty: number
}

export interface IRoadmapItemsCollection {
   roadmap_id: number;
   items: IRoadmapItem[];
}