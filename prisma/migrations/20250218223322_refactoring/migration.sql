/*
  Warnings:

  - You are about to drop the column `roadmap_item_id` on the `control_point` table. All the data in the column will be lost.
  - You are about to drop the `_attachmentToroadmap_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roadmap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roadmap_fact_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roadmap_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dashboard_item_id` to the `control_point` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_attachmentToroadmap_item" DROP CONSTRAINT "_attachmentToroadmap_item_A_fkey";

-- DropForeignKey
ALTER TABLE "_attachmentToroadmap_item" DROP CONSTRAINT "_attachmentToroadmap_item_B_fkey";

-- DropForeignKey
ALTER TABLE "control_point" DROP CONSTRAINT "control_point_roadmap_item_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap" DROP CONSTRAINT "roadmap_division_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap_fact_item" DROP CONSTRAINT "roadmap_fact_item_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap_fact_item" DROP CONSTRAINT "roadmap_fact_item_roadmap_item_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap_item" DROP CONSTRAINT "roadmap_item_project_id_fkey";

-- DropForeignKey
ALTER TABLE "roadmap_item" DROP CONSTRAINT "roadmap_item_roadmap_id_fkey";

-- AlterTable
ALTER TABLE "control_point" DROP COLUMN "roadmap_item_id",
ADD COLUMN     "dashboard_item_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_attachmentToroadmap_item";

-- DropTable
DROP TABLE "roadmap";

-- DropTable
DROP TABLE "roadmap_fact_item";

-- DropTable
DROP TABLE "roadmap_item";

-- CreateTable
CREATE TABLE "dashboard" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_item" (
    "id" SERIAL NOT NULL,
    "comment" VARCHAR(250),
    "dashboard_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "begin_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "dashboard_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_fact_item" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "hours" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "dashboard_item_id" INTEGER NOT NULL,

    CONSTRAINT "dashboard_fact_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_attachmentTodashboard_item" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_attachmentTodashboard_item_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_year_division_id_key" ON "dashboard"("year", "division_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_item_dashboard_id_project_id_key" ON "dashboard_item"("dashboard_id", "project_id");

-- CreateIndex
CREATE INDEX "_attachmentTodashboard_item_B_index" ON "_attachmentTodashboard_item"("B");

-- AddForeignKey
ALTER TABLE "dashboard" ADD CONSTRAINT "dashboard_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashboard_item" ADD CONSTRAINT "dashboard_item_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "dashboard"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashboard_item" ADD CONSTRAINT "dashboard_item_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashboard_fact_item" ADD CONSTRAINT "dashboard_fact_item_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dashboard_fact_item" ADD CONSTRAINT "dashboard_fact_item_dashboard_item_id_fkey" FOREIGN KEY ("dashboard_item_id") REFERENCES "dashboard_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_point" ADD CONSTRAINT "control_point_dashboard_item_id_fkey" FOREIGN KEY ("dashboard_item_id") REFERENCES "dashboard_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_attachmentTodashboard_item" ADD CONSTRAINT "_attachmentTodashboard_item_A_fkey" FOREIGN KEY ("A") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_attachmentTodashboard_item" ADD CONSTRAINT "_attachmentTodashboard_item_B_fkey" FOREIGN KEY ("B") REFERENCES "dashboard_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
