export interface IDivision {
   id?: number,
   name?: string,
   parent_id?: number,
   childrens?: IDivision[]
}

export interface IBaseDivision {
   id: number,
   name?: string | undefined | null,
   parent_id?: number | undefined | null
}