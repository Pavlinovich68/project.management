/*
  Warnings:

  - You are about to drop the `dept_calendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dept_calendar_cell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dept_calendar_row` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dept_calendar" DROP CONSTRAINT "dept_calendar_division_id_fkey";

-- DropForeignKey
ALTER TABLE "dept_calendar_cell" DROP CONSTRAINT "dept_calendar_cell_row_id_fkey";

-- DropForeignKey
ALTER TABLE "dept_calendar_row" DROP CONSTRAINT "dept_calendar_row_calendar_id_fkey";

-- DropForeignKey
ALTER TABLE "dept_calendar_row" DROP CONSTRAINT "dept_calendar_row_rate_id_fkey";

-- DropTable
DROP TABLE "dept_calendar";

-- DropTable
DROP TABLE "dept_calendar_cell";

-- DropTable
DROP TABLE "dept_calendar_row";
