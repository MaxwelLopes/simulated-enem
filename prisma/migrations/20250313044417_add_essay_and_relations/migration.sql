-- DropForeignKey
ALTER TABLE "Question_categories" DROP CONSTRAINT "Question_categories_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "Question_categories" DROP CONSTRAINT "Question_categories_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Simulated" DROP CONSTRAINT "Simulated_userId_fkey";

-- DropForeignKey
ALTER TABLE "Simulated_questions" DROP CONSTRAINT "Simulated_questions_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Simulated_questions" DROP CONSTRAINT "Simulated_questions_simulatedId_fkey";

-- CreateTable
CREATE TABLE "Essay" (
    "id" SERIAL NOT NULL,
    "theme" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "simulatedId" INTEGER NOT NULL,
    "motivationalTexts" TEXT[],
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Essay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssayScore" (
    "id" SERIAL NOT NULL,
    "criterion" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "justification" TEXT,
    "essayId" INTEGER NOT NULL,

    CONSTRAINT "EssayScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Essay_simulatedId_key" ON "Essay"("simulatedId");

-- CreateIndex
CREATE UNIQUE INDEX "EssayScore_essayId_criterion_key" ON "EssayScore"("essayId", "criterion");

-- AddForeignKey
ALTER TABLE "Question_categories" ADD CONSTRAINT "Question_categories_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question_categories" ADD CONSTRAINT "Question_categories_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated" ADD CONSTRAINT "Simulated_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated_questions" ADD CONSTRAINT "Simulated_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated_questions" ADD CONSTRAINT "Simulated_questions_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Essay" ADD CONSTRAINT "Essay_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayScore" ADD CONSTRAINT "EssayScore_essayId_fkey" FOREIGN KEY ("essayId") REFERENCES "Essay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
