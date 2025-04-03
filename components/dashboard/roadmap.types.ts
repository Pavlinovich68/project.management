import { IDashboardItemCRUD } from "@/models/IDashboardItem"

export type itemSignature = {
   (item: IDashboardItemCRUD | undefined): void
}