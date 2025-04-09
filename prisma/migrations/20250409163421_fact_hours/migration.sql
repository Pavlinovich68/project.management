/*
  Warnings:

  - You are about to drop the column `ratio` on the `roadmap_fact_item` table. All the data in the column will be lost.
  - Added the required column `hours` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_type` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_fact_item" DROP COLUMN "ratio",
ADD COLUMN     "hours" INTEGER NOT NULL,
ADD COLUMN     "work_type" INTEGER NOT NULL;
