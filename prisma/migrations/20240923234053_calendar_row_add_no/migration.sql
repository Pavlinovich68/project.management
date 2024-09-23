/*
  Warnings:

  - Added the required column `no` to the `dept_calendar_row` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dept_calendar_row" ADD COLUMN     "no" INTEGER NOT NULL;
