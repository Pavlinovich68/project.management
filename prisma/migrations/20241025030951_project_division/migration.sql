/*
  Warnings:

  - You are about to drop the column `labour_intensity` on the `roadmap_item` table. All the data in the column will be lost.
  - Added the required column `comment` to the `roadmap_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_item" DROP COLUMN "labour_intensity",
ADD COLUMN     "comment" VARCHAR(250) NOT NULL;

-- CreateTable
CREATE TABLE "project_division" (
    "id" SERIAL NOT NULL,
    "labour_intensity" INTEGER,
    "roadmap_item_id" INTEGER NOT NULL,

    CONSTRAINT "project_division_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_division" ADD CONSTRAINT "project_division_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
