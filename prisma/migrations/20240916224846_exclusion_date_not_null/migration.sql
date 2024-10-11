/*
  Warnings:

  - Made the column `date` on table `exclusion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "exclusion" ALTER COLUMN "date" SET NOT NULL;
