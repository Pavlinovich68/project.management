/*
  Warnings:

  - You are about to drop the column `developer_qnty` on the `roadmap_item` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `roadmap_item` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `roadmap_item` table. All the data in the column will be lost.
  - Added the required column `date` to the `roadmap_fact_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmap_fact_item" ADD COLUMN     "date" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "roadmap_item" DROP COLUMN "developer_qnty",
DROP COLUMN "end_date",
DROP COLUMN "start_date";
