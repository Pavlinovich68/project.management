/*
  Warnings:

  - You are about to drop the column `profile_id` on the `vacation` table. All the data in the column will be lost.
  - Added the required column `state_unit_id` to the `vacation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vacation" DROP CONSTRAINT "vacation_profile_id_fkey";

-- AlterTable
ALTER TABLE "vacation" DROP COLUMN "profile_id",
ADD COLUMN     "state_unit_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_state_unit_id_fkey" FOREIGN KEY ("state_unit_id") REFERENCES "state_unit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
