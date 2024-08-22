export interface ILegalEntity {
   id?: number | undefined | null,
   name: string,
   inn: string,
   ogrn?: string | undefined,
   address?: string | undefined,
   director?: string | undefined
}