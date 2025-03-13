/*
  Warnings:

  - You are about to drop the column `body` on the `attachment` table. All the data in the column will be lost.
  - Added the required column `bucket_name` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" DROP COLUMN "body",
ADD COLUMN     "bucket_name" VARCHAR(100) NOT NULL;
