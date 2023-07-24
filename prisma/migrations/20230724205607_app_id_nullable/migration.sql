-- DropForeignKey
ALTER TABLE "Developer" DROP CONSTRAINT "Developer_appId_fkey";

-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "appId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Developer" ADD CONSTRAINT "Developer_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE SET NULL ON UPDATE CASCADE;
