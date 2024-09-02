/*
  Warnings:

  - A unique constraint covering the columns `[date,production_calendar_id]` on the table `exclusion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "exclusion_date_production_calendar_id_key" ON "exclusion"("date", "production_calendar_id");
