/*
  Warnings:

  - You are about to drop the column `fact_item_id` on the `roadmap_item` table. All the data in the column will be lost.
  - Added the required column `roadmap_item_id` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "roadmap_item" DROP CONSTRAINT "roadmap_item_fact_item_id_fkey";

-- DropIndex
DROP INDEX "roadmap_item_fact_item_id_key";

-- AlterTable
ALTER TABLE "roadmap_fact_item" ADD COLUMN     "roadmap_item_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "roadmap_item" DROP COLUMN "fact_item_id";

-- AddForeignKey
ALTER TABLE "roadmap_fact_item" ADD CONSTRAINT "roadmap_fact_item_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
