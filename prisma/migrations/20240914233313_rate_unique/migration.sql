/*
  Warnings:

  - A unique constraint covering the columns `[division_id,no]` on the table `rate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rate_no_key";

-- CreateIndex
CREATE UNIQUE INDEX "rate_division_id_no_key" ON "rate"("division_id", "no");
