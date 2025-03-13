/*
  Warnings:

  - You are about to drop the column `md5` on the `attachment` table. All the data in the column will be lost.
  - Added the required column `etag` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `object_name` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" DROP COLUMN "md5",
ADD COLUMN     "etag" VARCHAR(32) NOT NULL,
ADD COLUMN     "object_name" VARCHAR(500) NOT NULL;
