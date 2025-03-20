/*
  Warnings:

  - You are about to drop the column `themeId` on the `Essay` table. All the data in the column will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `theme` to the `Essay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Essay" DROP CONSTRAINT "Essay_themeId_fkey";

-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "themeId",
ADD COLUMN     "motivationalTexts" TEXT[],
ADD COLUMN     "theme" TEXT NOT NULL;

-- DropTable
DROP TABLE "Theme";
