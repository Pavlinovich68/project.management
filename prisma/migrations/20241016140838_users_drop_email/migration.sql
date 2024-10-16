/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_email_u_ind";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email";
