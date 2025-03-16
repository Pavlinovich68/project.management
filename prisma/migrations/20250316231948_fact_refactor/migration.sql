/*
  Warnings:

  - You are about to drop the column `date` on the `roadmap_fact_item` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `roadmap_fact_item` table. All the data in the column will be lost.
  - Added the required column `day` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratio` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_fact_item" DROP COLUMN "date",
DROP COLUMN "hours",
ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "ratio" INTEGER NOT NULL;
