/*
  Warnings:

  - You are about to drop the column `profile_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profile_id_fkey";

-- DropIndex
DROP INDEX "users_profile_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_id";

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
