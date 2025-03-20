/*
  Warnings:

  - You are about to drop the column `simulatedId` on the `Essay` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `Essay` table. All the data in the column will be lost.
  - You are about to drop the column `userText` on the `Essay` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the `EssayScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Simulated_questions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userText` to the `Simulated` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Essay" DROP CONSTRAINT "Essay_simulatedId_fkey";

-- DropForeignKey
ALTER TABLE "EssayScore" DROP CONSTRAINT "EssayScore_essayId_fkey";

-- DropForeignKey
ALTER TABLE "Question_categories" DROP CONSTRAINT "Question_categories_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "Question_categories" DROP CONSTRAINT "Question_categories_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Simulated_questions" DROP CONSTRAINT "Simulated_questions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Simulated_questions" DROP CONSTRAINT "Simulated_questions_simulatedId_fkey";

-- DropIndex
DROP INDEX "Essay_simulatedId_key";

-- AlterTable
ALTER TABLE "Essay" DROP COLUMN "simulatedId",
DROP COLUMN "totalScore",
DROP COLUMN "userText";

-- AlterTable
ALTER TABLE "Simulated" ADD COLUMN     "completionTimeSeconds" INTEGER,
ADD COLUMN     "essayId" INTEGER,
ADD COLUMN     "userText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "description";

-- DropTable
DROP TABLE "EssayScore";

-- DropTable
DROP TABLE "Question_categories";

-- DropTable
DROP TABLE "Simulated_questions";

-- CreateTable
CREATE TABLE "QuestionCategory" (
    "questionId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("questionId","categoryId")
);

-- CreateTable
CREATE TABLE "SimulatedQuestion" (
    "simulatedId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "hit" BOOLEAN,
    "response" TEXT,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(0),

    CONSTRAINT "SimulatedQuestion_pkey" PRIMARY KEY ("simulatedId","questionId")
);

-- CreateTable
CREATE TABLE "SimulatedEssayScore" (
    "id" SERIAL NOT NULL,
    "simulatedId" INTEGER NOT NULL,
    "criterion" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "justification" TEXT,

    CONSTRAINT "SimulatedEssayScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionCategory" ADD CONSTRAINT "QuestionCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCategory" ADD CONSTRAINT "QuestionCategory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated" ADD CONSTRAINT "Simulated_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "Essay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatedQuestion" ADD CONSTRAINT "SimulatedQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatedQuestion" ADD CONSTRAINT "SimulatedQuestion_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatedEssayScore" ADD CONSTRAINT "SimulatedEssayScore_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE CASCADE ON UPDATE CASCADE;
