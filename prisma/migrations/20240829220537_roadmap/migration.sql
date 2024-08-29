-- CreateTable
CREATE TABLE "roadmap" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_item" (
    "id" SERIAL NOT NULL,
    "roadmap_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "module_id" INTEGER,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "labour_intensity" INTEGER,

    CONSTRAINT "roadmap_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "control_point" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "roadmap_item_id" INTEGER NOT NULL,

    CONSTRAINT "control_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_attachmentToroadmap_item" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_attachmentToroadmap_item_AB_unique" ON "_attachmentToroadmap_item"("A", "B");

-- CreateIndex
CREATE INDEX "_attachmentToroadmap_item_B_index" ON "_attachmentToroadmap_item"("B");

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roadmap_item" ADD CONSTRAINT "roadmap_item_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "control_point" ADD CONSTRAINT "control_point_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_attachmentToroadmap_item" ADD CONSTRAINT "_attachmentToroadmap_item_A_fkey" FOREIGN KEY ("A") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_attachmentToroadmap_item" ADD CONSTRAINT "_attachmentToroadmap_item_B_fkey" FOREIGN KEY ("B") REFERENCES "roadmap_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
