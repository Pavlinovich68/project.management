/*
  Warnings:

  - You are about to drop the column `state_unit_id` on the `vacation` table. All the data in the column will be lost.
  - You are about to drop the `state_unit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `staff_id` to the `vacation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "state_unit" DROP CONSTRAINT "state_unit_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "state_unit" DROP CONSTRAINT "state_unit_stuff_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "vacation" DROP CONSTRAINT "vacation_state_unit_id_fkey";

-- AlterTable
ALTER TABLE "vacation" DROP COLUMN "state_unit_id",
ADD COLUMN     "staff_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "state_unit";

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "stuff_unit_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_stuff_unit_id_fkey" FOREIGN KEY ("stuff_unit_id") REFERENCES "stuff_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
