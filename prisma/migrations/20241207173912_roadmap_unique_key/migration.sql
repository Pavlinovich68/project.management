/*
  Warnings:

  - A unique constraint covering the columns `[roadmap_id,project_id]` on the table `roadmap_item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roadmap_item_roadmap_id_project_id_key" ON "roadmap_item"("roadmap_id", "project_id");
