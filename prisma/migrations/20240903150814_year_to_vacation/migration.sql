/*
  Warnings:

  - Added the required column `year` to the `vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vacation" ADD COLUMN     "year" INTEGER NOT NULL;
