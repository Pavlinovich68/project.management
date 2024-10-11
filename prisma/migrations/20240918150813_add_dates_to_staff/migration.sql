/*
  Warnings:

  - Added the required column `begin_date` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "begin_date" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(6) NOT NULL;
