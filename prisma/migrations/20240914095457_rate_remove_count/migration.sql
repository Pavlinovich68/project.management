/*
  Warnings:

  - You are about to drop the column `count` on the `rate` table. All the data in the column will be lost.
  - Added the required column `no` to the `rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rate" DROP COLUMN "count",
ADD COLUMN     "no" INTEGER NOT NULL;
