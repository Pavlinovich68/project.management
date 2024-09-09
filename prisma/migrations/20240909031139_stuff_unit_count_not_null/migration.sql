/*
  Warnings:

  - Made the column `count` on table `stuff_unit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stuff_unit" ALTER COLUMN "count" SET NOT NULL;
