import { IRoadmapItemCRUD } from "@/models/IDashboardItem"

export type itemSignature = {
   (item: IRoadmapItemCRUD | undefined): void
}