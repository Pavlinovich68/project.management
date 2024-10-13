/*
  Warnings:

  - You are about to drop the column `pathname` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `employee` table. All the data in the column will be lost.
  - Made the column `name` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employee" DROP COLUMN "pathname",
DROP COLUMN "surname",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(75);
