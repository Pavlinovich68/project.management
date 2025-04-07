/*
  Warnings:

  - A unique constraint covering the columns `[year,month,day,rate_id]` on the table `personal_exclusion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "personal_exclusion_year_month_day_rate_id_key" ON "personal_exclusion"("year", "month", "day", "rate_id");
