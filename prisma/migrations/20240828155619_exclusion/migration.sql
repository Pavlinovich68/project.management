-- CreateTable
CREATE TABLE "production_calendar" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "production_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exclusion" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "exclusion_type" INTEGER NOT NULL,
    "production_calendar_id" INTEGER NOT NULL,

    CONSTRAINT "exclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exclusion" ADD CONSTRAINT "exclusion_production_calendar_id_fkey" FOREIGN KEY ("production_calendar_id") REFERENCES "production_calendar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
