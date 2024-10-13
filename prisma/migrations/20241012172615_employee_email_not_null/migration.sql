/*
  Warnings:

  - Made the column `email` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "email" SET NOT NULL;
