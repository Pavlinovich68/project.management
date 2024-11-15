import { IRoadmapItemCRUD } from "@/models/IRoadmapItem"

export type itemSeignature = {
   (item: IRoadmapItemCRUD | undefined): void
}