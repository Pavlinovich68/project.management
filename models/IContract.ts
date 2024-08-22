import { BaseEntity } from "./BaseEntity";
import { IAgreement } from "./IAgreement";
import { IContractAttachment } from "./IContractAttachment";

export interface IContract {
   id?: number | undefined | null,
   registry_number?: string,
   subject?: string | undefined,
   price?: number | undefined | null,
   contract_number?: string | undefined,
   contract_date?: Date | undefined | null,
   execute_date?: Date | undefined | null,
   purchase_type?: number,
   purchase_type_comment?: string |undefined,
   nmck?: number |undefined | null,
   economy?: number |undefined | null,
   comments?: string |undefined,
   is_eis: boolean,
   date_added?: Date |undefined | null,
   version?: number |undefined | null,
   supplier_method?: string |undefined | null,
   indiv_inn?: string |undefined | null,
   indiv_name?: string |undefined | null,
   is_closed: boolean,
   state?: string |undefined | null,
   kcsr?: string |undefined | null,
   status?: number |undefined | null
   division?: BaseEntity | undefined | null,
   project?: BaseEntity | undefined | null
   customer_id?: number | undefined | null,
   customer_inn?: string | undefined,
   customer_name?: string | undefined,
   contractor_id?: number | undefined | null,
   contractor_inn?: string | undefined,
   contractor_name?: string | undefined,
   agreements?: IAgreement[] | undefined
   attachments?: IContractAttachment[] | undefined
}