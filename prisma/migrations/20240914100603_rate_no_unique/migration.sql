/*
  Warnings:

  - A unique constraint covering the columns `[no]` on the table `rate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rate_no_key" ON "rate"("no");
