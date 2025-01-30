/*
  Warnings:

  - A unique constraint covering the columns `[fact_item_id]` on the table `roadmap_item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fact_item_id` to the `roadmap_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_item" ADD COLUMN     "fact_item_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "roadmap_fact_item" (
    "id" SERIAL NOT NULL,
    "hours" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "roadmap_fact_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_item_fact_item_id_key" ON "roadmap_item"("fact_item_id");

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_fact_item_id_fkey" FOREIGN KEY ("fact_item_id") REFERENCES "roadmap_fact_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_fact_item" ADD CONSTRAINT "roadmap_fact_item_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
