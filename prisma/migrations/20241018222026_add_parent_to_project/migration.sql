-- AlterTable
ALTER TABLE "project" ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
