/*
  Warnings:

  - You are about to drop the column `is_work_time` on the `rate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rate" DROP COLUMN "is_work_time",
ADD COLUMN     "is_production_staff" BOOLEAN NOT NULL DEFAULT true;
