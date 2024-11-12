export interface IRoadmapItem {
   roadmap_id: number,
   id: number,
   project_id: number,
   project_code: string,
   project_name: string
}

export interface IRoadmapItemCRUD {
   id: number | undefined | null,            
   comment: string | undefined | null | null,
   roadmap_id: number | undefined | null,    
   project_id: number | undefined | null,    
   project_name: string | undefined | null,  
   start_date: Date | undefined | null,
   end_date: Date | undefined | null,
   hours: number | undefined | null,
   developer_qnty: number | undefined | null
}