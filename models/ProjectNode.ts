export interface ProjectNode {
   id?: number | undefined | null,
   code: string,
   name: string,
   short_name: string,
   childrens: ProjectNode[]
}