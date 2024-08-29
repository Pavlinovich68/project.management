-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "begin_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(6);

-- CreateTable
CREATE TABLE "days_off" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "type" INTEGER NOT NULL,
    "comment" VARCHAR(150) NOT NULL,

    CONSTRAINT "days_off_pkey" PRIMARY KEY ("id")
);
