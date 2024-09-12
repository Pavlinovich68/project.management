-- CreateTable
CREATE TABLE "state_unit" (
    "id" SERIAL NOT NULL,
    "stuff_unit_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "begin_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(6),

    CONSTRAINT "state_unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "state_unit" ADD CONSTRAINT "state_unit_stuff_unit_id_fkey" FOREIGN KEY ("stuff_unit_id") REFERENCES "stuff_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "state_unit" ADD CONSTRAINT "state_unit_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
