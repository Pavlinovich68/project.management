/*
  Warnings:

  - A unique constraint covering the columns `[year,division_id]` on the table `roadmap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roadmap_year_division_id_key" ON "roadmap"("year", "division_id");
