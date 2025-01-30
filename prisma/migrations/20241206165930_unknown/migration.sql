-- AlterTable
ALTER TABLE "_attachmentToroadmap_item" ADD CONSTRAINT "_attachmentToroadmap_item_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_attachmentToroadmap_item_AB_unique";
