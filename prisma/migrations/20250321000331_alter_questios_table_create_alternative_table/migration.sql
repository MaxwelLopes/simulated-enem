/*
  Warnings:

  - You are about to drop the column `alternativeA` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeB` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeC` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeD` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeE` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `correctAlternative` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "alternativeA",
DROP COLUMN "alternativeB",
DROP COLUMN "alternativeC",
DROP COLUMN "alternativeD",
DROP COLUMN "alternativeE",
DROP COLUMN "correctAlternative",
ALTER COLUMN "year" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Alternative" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "letter" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Alternative_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alternative" ADD CONSTRAINT "Alternative_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
