-- CreateTable
CREATE TABLE "acc_hours" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "rate_id" INTEGER NOT NULL,

    CONSTRAINT "acc_hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "acc_hours" ADD CONSTRAINT "acc_hours_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
