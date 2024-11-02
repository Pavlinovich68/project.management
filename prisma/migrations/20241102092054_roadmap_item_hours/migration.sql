/*
  Warnings:

  - You are about to drop the column `end_date` on the `roadmap_item` table. All the data in the column will be lost.
  - Added the required column `hours` to the `roadmap_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_item" DROP COLUMN "end_date",
ADD COLUMN     "hours" INTEGER NOT NULL;
