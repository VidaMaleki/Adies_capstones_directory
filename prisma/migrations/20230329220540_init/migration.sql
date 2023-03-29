-- CreateTable
CREATE TABLE "Developers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "linkedin" TEXT,
    "app_id" INTEGER NOT NULL,

    CONSTRAINT "Developers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apps" (
    "id" SERIAL NOT NULL,
    "appName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "appLink" TEXT,
    "videoLink" TEXT,
    "github" TEXT,
    "type" TEXT NOT NULL,
    "technologies" TEXT[],

    CONSTRAINT "Apps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Developers_email_key" ON "Developers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Developers_app_id_key" ON "Developers"("app_id");

-- AddForeignKey
ALTER TABLE "Developers" ADD CONSTRAINT "Developers_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "Apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
