/*
  Warnings:

  - You are about to drop the column `date` on the `dept_calendar_cell` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[month,day,row_id]` on the table `dept_calendar_cell` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `day` to the `dept_calendar_cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `dept_calendar_cell` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dept_calendar_cell_date_row_id_key";

-- AlterTable
ALTER TABLE "dept_calendar_cell" DROP COLUMN "date",
ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dept_calendar_cell_month_day_row_id_key" ON "dept_calendar_cell"("month", "day", "row_id");
