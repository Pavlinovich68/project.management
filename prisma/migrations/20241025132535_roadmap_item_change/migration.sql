/*
  Warnings:

  - Made the column `project_id` on table `roadmap_item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "roadmap_item" ALTER COLUMN "project_id" SET NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;
