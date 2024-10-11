/*
  Warnings:

  - A unique constraint covering the columns `[year,division_id]` on the table `dept_calendar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dept_calendar_year_division_id_key" ON "dept_calendar"("year", "division_id");
