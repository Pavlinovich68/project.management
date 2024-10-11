/*
  Warnings:

  - A unique constraint covering the columns `[no]` on the table `rate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,division_id]` on the table `rate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rate_division_id_key";

-- DropIndex
DROP INDEX "rate_division_id_no_key";

-- CreateIndex
CREATE UNIQUE INDEX "rate_no_key" ON "rate"("no");

-- CreateIndex
CREATE UNIQUE INDEX "rate_id_division_id_key" ON "rate"("id", "division_id");
