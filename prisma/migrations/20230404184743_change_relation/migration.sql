/*
  Warnings:

  - You are about to drop the column `app_id` on the `Developers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Developers" DROP CONSTRAINT "Developers_app_id_fkey";

-- DropIndex
DROP INDEX "Developers_app_id_key";

-- AlterTable
ALTER TABLE "Developers" DROP COLUMN "app_id";

-- CreateTable
CREATE TABLE "_AppDevelopers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppDevelopers_AB_unique" ON "_AppDevelopers"("A", "B");

-- CreateIndex
CREATE INDEX "_AppDevelopers_B_index" ON "_AppDevelopers"("B");

-- AddForeignKey
ALTER TABLE "_AppDevelopers" ADD CONSTRAINT "_AppDevelopers_A_fkey" FOREIGN KEY ("A") REFERENCES "Apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppDevelopers" ADD CONSTRAINT "_AppDevelopers_B_fkey" FOREIGN KEY ("B") REFERENCES "Developers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
