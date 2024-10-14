/*
  Warnings:

  - You are about to drop the column `division_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_division_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "division_id";
