-- CreateTable
CREATE TABLE "Developer" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN DEFAULT false,
    "image" TEXT DEFAULT '/auth/user-in-gray-circle.png',
    "cohort" TEXT NOT NULL,
    "linkedin" TEXT,
    "password" TEXT NOT NULL,
    "appId" INTEGER,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" SERIAL NOT NULL,
    "appName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "appLink" TEXT NOT NULL,
    "videoLink" TEXT NOT NULL,
    "github" TEXT,
    "type" TEXT NOT NULL,
    "technologies" TEXT[],

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_email_key" ON "Developer"("email");

-- AddForeignKey
ALTER TABLE "Developer" ADD CONSTRAINT "Developer_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE SET NULL ON UPDATE CASCADE;
