/*
  Warnings:

  - You are about to drop the column `motivationalTexts` on the `Essay` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Essay` table. All the data in the column will be lost.
  - Added the required column `themeId` to the `Essay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userText` to the `Essay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "motivationalTexts",
DROP COLUMN "theme",
ADD COLUMN     "themeId" INTEGER NOT NULL,
ADD COLUMN     "userText" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "motivationalTexts" TEXT[],

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_title_key" ON "Theme"("title");

-- AddForeignKey
ALTER TABLE "Essay" ADD CONSTRAINT "Essay_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
