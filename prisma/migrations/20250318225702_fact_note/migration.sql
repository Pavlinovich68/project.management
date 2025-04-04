/*
  Warnings:

  - Added the required column `note` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_fact_item" ADD COLUMN     "note" TEXT NOT NULL;
