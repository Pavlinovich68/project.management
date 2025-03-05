/*
  Warnings:

  - You are about to drop the column `dashboard_item_id` on the `control_point` table. All the data in the column will be lost.
  - You are about to drop the `_attachmentTodashboard_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard_fact_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dashboard_item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roadmap_item_id` to the `control_point` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_attachmentTodashboard_item" DROP CONSTRAINT "_attachmentTodashboard_item_A_fkey";

-- DropForeignKey
ALTER TABLE "_attachmentTodashboard_item" DROP CONSTRAINT "_attachmentTodashboard_item_B_fkey";

-- DropForeignKey
ALTER TABLE "control_point" DROP CONSTRAINT "control_point_dashboard_item_id_fkey";

-- DropForeignKey
ALTER TABLE "dashboard" DROP CONSTRAINT "dashboard_division_id_fkey";

-- DropForeignKey
ALTER TABLE "dashboard_fact_item" DROP CONSTRAINT "dashboard_fact_item_dashboard_item_id_fkey";

-- DropForeignKey
ALTER TABLE "dashboard_fact_item" DROP CONSTRAINT "dashboard_fact_item_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "dashboard_item" DROP CONSTRAINT "dashboard_item_dashboard_id_fkey";

-- DropForeignKey
ALTER TABLE "dashboard_item" DROP CONSTRAINT "dashboard_item_project_id_fkey";

-- AlterTable
ALTER TABLE "control_point" DROP COLUMN "dashboard_item_id",
ADD COLUMN     "roadmap_item_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_attachmentTodashboard_item";

-- DropTable
DROP TABLE "dashboard";

-- DropTable
DROP TABLE "dashboard_fact_item";

-- DropTable
DROP TABLE "dashboard_item";

-- CreateTable
CREATE TABLE "roadmap" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_item" (
    "id" SERIAL NOT NULL,
    "comment" VARCHAR(250),
    "roadmap_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "begin_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "roadmap_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_fact_item" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "hours" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "roadmap_item_id" INTEGER NOT NULL,

    CONSTRAINT "roadmap_fact_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_attachmentToroadmap_item" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_attachmentToroadmap_item_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_year_division_id_key" ON "roadmap"("year", "division_id");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_item_roadmap_id_project_id_key" ON "roadmap_item"("roadmap_id", "project_id");

-- CreateIndex
CREATE INDEX "_attachmentToroadmap_item_B_index" ON "_attachmentToroadmap_item"("B");

-- AddForeignKey
ALTER TABLE "roadmap" ADD CONSTRAINT "roadmap_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roadmap_fact_item" ADD CONSTRAINT "roadmap_fact_item_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roadmap_fact_item" ADD CONSTRAINT "roadmap_fact_item_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_point" ADD CONSTRAINT "control_point_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_attachmentToroadmap_item" ADD CONSTRAINT "_attachmentToroadmap_item_A_fkey" FOREIGN KEY ("A") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_attachmentToroadmap_item" ADD CONSTRAINT "_attachmentToroadmap_item_B_fkey" FOREIGN KEY ("B") REFERENCES "roadmap_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
