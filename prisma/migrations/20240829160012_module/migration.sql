-- CreateTable
CREATE TABLE "module" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "module" ADD CONSTRAINT "module_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
