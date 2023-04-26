/*
  Warnings:

  - You are about to drop the column `name` on the `Developer` table. All the data in the column will be lost.
  - Added the required column `cohort` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Developer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Developer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "name",
ADD COLUMN     "cohort" INTEGER NOT NULL,
ADD COLUMN     "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "image" TEXT DEFAULT 'https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642479/992490_sskqn3.png',
ADD COLUMN     "password" TEXT NOT NULL;
