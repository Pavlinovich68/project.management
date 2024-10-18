/*
  Warnings:

  - You are about to drop the column `begin_date` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `division_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `roadmap_item` table. All the data in the column will be lost.
  - You are about to drop the `module` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "module" DROP CONSTRAINT "module_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_division_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap_item" DROP CONSTRAINT "roadmap_item_module_id_fkey";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "begin_date",
DROP COLUMN "division_id",
DROP COLUMN "end_date";

-- AlterTable
ALTER TABLE "roadmap_item" DROP COLUMN "module_id";

-- DropTable
DROP TABLE "module";
