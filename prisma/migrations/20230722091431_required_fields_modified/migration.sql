/*
  Warnings:

  - Made the column `github` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailVerified` on table `Developer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Developer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `linkedin` on table `Developer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `appId` on table `Developer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Developer" DROP CONSTRAINT "Developer_appId_fkey";

-- AlterTable
ALTER TABLE "App" ALTER COLUMN "videoLink" DROP NOT NULL,
ALTER COLUMN "github" SET NOT NULL;

-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "emailVerified" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "linkedin" SET NOT NULL,
ALTER COLUMN "appId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Developer" ADD CONSTRAINT "Developer_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
