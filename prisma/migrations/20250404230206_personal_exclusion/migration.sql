-- CreateTable
CREATE TABLE "personal_exclusion" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "rate_id" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "personal_exclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "personal_exclusion" ADD CONSTRAINT "personal_exclusion_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personal_exclusion" ADD CONSTRAINT "personal_exclusion_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
