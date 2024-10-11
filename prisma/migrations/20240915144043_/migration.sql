/*
  Warnings:

  - A unique constraint covering the columns `[day,month,row_id]` on the table `dept_calendar_cell` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id,calendar_id]` on the table `dept_calendar_row` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dept_calendar_cell_day_month_row_id_key" ON "dept_calendar_cell"("day", "month", "row_id");

-- CreateIndex
CREATE UNIQUE INDEX "dept_calendar_row_staff_id_calendar_id_key" ON "dept_calendar_row"("staff_id", "calendar_id");
