export interface IAttachment {
   id: number | undefined
   filename: string
   object_name: string
   bucket_name: string
   date: Date
   size: number
   type: string
   etag: string
}