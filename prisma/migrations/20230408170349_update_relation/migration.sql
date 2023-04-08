/*
  Warnings:

  - You are about to drop the `Apps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Developers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AppDevelopers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AppDevelopers" DROP CONSTRAINT "_AppDevelopers_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppDevelopers" DROP CONSTRAINT "_AppDevelopers_B_fkey";

-- DropTable
DROP TABLE "Apps";

-- DropTable
DROP TABLE "Developers";

-- DropTable
DROP TABLE "_AppDevelopers";

-- CreateTable
CREATE TABLE "Developer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "linkedin" TEXT,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" SERIAL NOT NULL,
    "appName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "developers" TEXT[],
    "appLink" TEXT,
    "videoLink" TEXT,
    "github" TEXT,
    "type" TEXT NOT NULL,
    "technologies" TEXT[],

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_email_key" ON "Developer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "App_ownerId_key" ON "App"("ownerId");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
