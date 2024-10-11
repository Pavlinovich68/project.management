-- CreateTable
CREATE TABLE "dept_calendar" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "division_id" INTEGER NOT NULL,

    CONSTRAINT "dept_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_calendar_row" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "calendar_id" INTEGER NOT NULL,

    CONSTRAINT "dept_calendar_row_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_calendar_cell" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "row_id" INTEGER NOT NULL,

    CONSTRAINT "dept_calendar_cell_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dept_calendar" ADD CONSTRAINT "dept_calendar_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dept_calendar_row" ADD CONSTRAINT "dept_calendar_row_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "dept_calendar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dept_calendar_cell" ADD CONSTRAINT "dept_calendar_cell_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "dept_calendar_row"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
