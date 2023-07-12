/*
  Warnings:

  - You are about to drop the column `developers` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `App` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_ownerId_fkey";

-- DropIndex
DROP INDEX "App_ownerId_key";

-- AlterTable
ALTER TABLE "App" DROP COLUMN "developers",
DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "Developer" ADD COLUMN     "appId" INTEGER;

-- AddForeignKey
ALTER TABLE "Developer" ADD CONSTRAINT "Developer_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE SET NULL ON UPDATE CASCADE;
