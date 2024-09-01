/*
  Warnings:

  - You are about to drop the column `day` on the `exclusion` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `exclusion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exclusion" DROP COLUMN "day",
DROP COLUMN "month",
ADD COLUMN     "date" TIMESTAMP(6);
