/*
  Warnings:

  - A unique constraint covering the columns `[division_id]` on the table `rate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rate_division_id_key" ON "rate"("division_id");
