-- DropForeignKey
ALTER TABLE "roadmap_item" DROP CONSTRAINT "roadmap_item_fact_item_id_fkey";

-- AlterTable
ALTER TABLE "roadmap_item" ALTER COLUMN "fact_item_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_fact_item_id_fkey" FOREIGN KEY ("fact_item_id") REFERENCES "roadmap_fact_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
