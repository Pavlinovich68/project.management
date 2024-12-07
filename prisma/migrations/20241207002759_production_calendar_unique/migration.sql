/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `production_calendar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "production_calendar_year_key" ON "production_calendar"("year");
