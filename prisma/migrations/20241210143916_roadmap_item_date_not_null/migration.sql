/*
  Warnings:

  - Made the column `begin_date` on table `roadmap_item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "roadmap_item" ALTER COLUMN "begin_date" SET NOT NULL;
