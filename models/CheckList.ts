import { BaseEntity } from "./BaseEntity";

export interface CheckList {
   id?: number | undefined | null,
   close_date?: Date | undefined | null,
   name: string,
   project?: BaseEntity | undefined | null,
   division?: BaseEntity | undefined | null,
   sections: CheckListSection[] | undefined
}

export interface CheckListSection {
   guid?: string |undefined | null,
   id?: number | undefined | null,
   name: string,
   order_no: number,
   items: CheckListItem[] | undefined
}

export interface CheckListItem {
   parent?: CheckListSection | undefined,
   guid?: string |undefined | null,
   id?: number | undefined | null,
   name: string,
   order_no: number,
   end_point?: Date | undefined | null,
   is_closed: boolean
}