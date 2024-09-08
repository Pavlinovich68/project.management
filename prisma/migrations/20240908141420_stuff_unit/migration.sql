-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stuff_unit" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "begin_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "stuff_unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stuff_unit" ADD CONSTRAINT "stuff_unit_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stuff_unit" ADD CONSTRAINT "stuff_unit_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
