/*
  Warnings:

  - You are about to drop the column `stuff_unit_id` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the `stuff_unit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rate_id` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_stuff_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "stuff_unit" DROP CONSTRAINT "stuff_unit_division_id_fkey";

-- DropForeignKey
ALTER TABLE "stuff_unit" DROP CONSTRAINT "stuff_unit_post_id_fkey";

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "stuff_unit_id",
ADD COLUMN     "rate_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "stuff_unit";

-- CreateTable
CREATE TABLE "rate" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "rate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rate" ADD CONSTRAINT "rate_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rate" ADD CONSTRAINT "rate_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
