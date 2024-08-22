export interface Division {
   id?: number,
   name?: string,
   short_name?: string,
   contacts?: string,
   parent_id?: number,
   childrens?: Division[],
   attachment_id?: number | undefined | null
}