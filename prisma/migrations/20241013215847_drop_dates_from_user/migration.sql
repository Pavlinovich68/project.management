/*
  Warnings:

  - You are about to drop the column `begin_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "begin_date",
DROP COLUMN "end_date";
