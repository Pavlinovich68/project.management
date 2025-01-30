/*
  Warnings:

  - You are about to drop the column `fact_end_date` on the `roadmap_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "_attachmentToroadmap_item" ADD CONSTRAINT "_attachmentToroadmap_item_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_attachmentToroadmap_item_AB_unique";

-- AlterTable
ALTER TABLE "roadmap_item" DROP COLUMN "fact_end_date",
ADD COLUMN     "is_closed" BOOLEAN NOT NULL DEFAULT false;
