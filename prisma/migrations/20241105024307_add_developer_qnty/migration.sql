/*
  Warnings:

  - You are about to drop the `project_division` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `division_id` to the `roadmap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developer_qnty` to the `roadmap_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_division" DROP CONSTRAINT "project_division_roadmap_item_id_fkey";

-- AlterTable
ALTER TABLE "roadmap" ADD COLUMN     "division_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "roadmap_item" ADD COLUMN     "developer_qnty" INTEGER NOT NULL;

-- DropTable
DROP TABLE "project_division";

-- AddForeignKey
ALTER TABLE "roadmap" ADD CONSTRAINT "roadmap_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
