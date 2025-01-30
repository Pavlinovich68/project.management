/*
  Warnings:

  - The primary key for the `_attachmentToroadmap_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_attachmentToroadmap_item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_attachmentToroadmap_item" DROP CONSTRAINT "_attachmentToroadmap_item_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_attachmentToroadmap_item_AB_unique" ON "_attachmentToroadmap_item"("A", "B");
