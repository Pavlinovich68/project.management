/*
  Warnings:

  - You are about to drop the column `day` on the `dept_calendar_cell` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `dept_calendar_cell` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,row_id]` on the table `dept_calendar_cell` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `dept_calendar_cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hours` to the `dept_calendar_cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `header` to the `dept_calendar_row` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dept_calendar_cell_day_month_row_id_key";

-- AlterTable
ALTER TABLE "dept_calendar_cell" DROP COLUMN "day",
DROP COLUMN "month",
ADD COLUMN     "date" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "hours" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "dept_calendar_row" ADD COLUMN     "header" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dept_calendar_cell_date_row_id_key" ON "dept_calendar_cell"("date", "row_id");
