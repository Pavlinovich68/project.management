/*
  Warnings:

  - Added the required column `is_boss` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "is_boss" BOOLEAN NOT NULL;
