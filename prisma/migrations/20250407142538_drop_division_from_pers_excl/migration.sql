/*
  Warnings:

  - You are about to drop the column `division_id` on the `personal_exclusion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "personal_exclusion" DROP CONSTRAINT "personal_exclusion_division_id_fkey";

-- AlterTable
ALTER TABLE "personal_exclusion" DROP COLUMN "division_id";
