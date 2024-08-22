export interface IDocument {
   id?: number,
   name?: string,
   parent_id?: number,
   childrens?: IDocument[],
   attachment_id?: number | undefined | null
   is_closed: boolean
}