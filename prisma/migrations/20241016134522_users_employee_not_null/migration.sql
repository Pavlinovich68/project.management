/*
  Warnings:

  - Made the column `employee_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "employee_id" SET NOT NULL;
