export interface IContractAttachment {
   id?: number | undefined,
   file_name?: string | undefined,
   file_link?: string | undefined,
   is_real_file: boolean,
   attachment_id?: number | undefined | null,
   file?: File | undefined
}