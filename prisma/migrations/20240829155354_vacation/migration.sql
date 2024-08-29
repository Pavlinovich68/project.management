-- CreateTable
CREATE TABLE "vacation" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "vacation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vacation" ADD CONSTRAINT "vacation_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
