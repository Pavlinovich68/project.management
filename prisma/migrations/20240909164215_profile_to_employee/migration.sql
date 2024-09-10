/*
  Warnings:

  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vacation" DROP CONSTRAINT "vacation_profile_id_fkey";

-- DropTable
DROP TABLE "profile";

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25),
    "surname" VARCHAR(25),
    "pathname" VARCHAR(25),
    "begin_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(6),

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
