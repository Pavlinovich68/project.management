/*
  Warnings:

  - Added the required column `value` to the `acc_hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "acc_hours" ADD COLUMN     "value" INTEGER NOT NULL;
