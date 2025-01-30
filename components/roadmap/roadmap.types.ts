import { IRoadmapItemCRUD } from "@/models/IRoadmapItem"

export type itemSignature = {
   (item: IRoadmapItemCRUD | undefined): void
}