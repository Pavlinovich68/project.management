/*
  Warnings:

  - You are about to drop the column `hierarchy_level` on the `staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "hierarchy_level" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "hierarchy_level";
