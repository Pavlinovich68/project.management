/*
  Warnings:

  - You are about to drop the column `date` on the `days_off` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `days_off` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `days_off` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "days_off" DROP COLUMN "date",
ADD COLUMN     "end_date" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(6) NOT NULL;
