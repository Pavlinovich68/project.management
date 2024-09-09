/*
  Warnings:

  - You are about to drop the column `is_boss` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `short_name` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `stack` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_fkey";

-- DropIndex
DROP INDEX "profile_user_id_key";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "is_boss",
DROP COLUMN "short_name",
DROP COLUMN "stack",
DROP COLUMN "user_id",
ADD COLUMN     "name" VARCHAR(25),
ADD COLUMN     "pathname" VARCHAR(25),
ADD COLUMN     "surname" VARCHAR(25);
