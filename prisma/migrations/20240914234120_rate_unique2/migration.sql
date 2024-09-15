/*
  Warnings:

  - A unique constraint covering the columns `[no,division_id]` on the table `rate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rate_id_division_id_key";

-- DropIndex
DROP INDEX "rate_no_key";

-- CreateIndex
CREATE UNIQUE INDEX "rate_no_division_id_key" ON "rate"("no", "division_id");
