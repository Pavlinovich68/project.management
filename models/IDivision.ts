export interface IDivision {
   id?: number,
   name?: string,
   parent_id?: number,
   childrens?: IDivision[]
}