/*
  Warnings:

  - You are about to drop the `acc_hours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "acc_hours" DROP CONSTRAINT "acc_hours_rate_id_fkey";

-- DropTable
DROP TABLE "acc_hours";
