/*
  Warnings:

  - You are about to drop the column `staff_id` on the `dept_calendar_row` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rate_id,calendar_id]` on the table `dept_calendar_row` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rate_id` to the `dept_calendar_row` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dept_calendar_row_staff_id_calendar_id_key";

-- AlterTable
ALTER TABLE "dept_calendar_row" DROP COLUMN "staff_id",
ADD COLUMN     "rate_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dept_calendar_row_rate_id_calendar_id_key" ON "dept_calendar_row"("rate_id", "calendar_id");

-- AddForeignKey
ALTER TABLE "dept_calendar_row" ADD CONSTRAINT "dept_calendar_row_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
