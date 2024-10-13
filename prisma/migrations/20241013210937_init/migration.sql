-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "year" VARCHAR(4) NOT NULL,
    "disciplineId" INTEGER,
    "subjectId" INTEGER,
    "context" TEXT,
    "alternativesIntroduction" TEXT,
    "correctAlternative" VARCHAR(1) NOT NULL,
    "alternativeA" TEXT NOT NULL,
    "alternativeB" TEXT NOT NULL,
    "alternativeC" TEXT NOT NULL,
    "alternativeD" TEXT NOT NULL,
    "alternativeE" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question_categories" (
    "questionId" INTEGER NOT NULL,
    "categoriesId" INTEGER NOT NULL,

    CONSTRAINT "Question_categories_pkey" PRIMARY KEY ("questionId","categoriesId")
);

-- CreateTable
CREATE TABLE "Simulated" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(0),
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "Simulated_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulated_questions" (
    "simulatedId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "hit" BOOLEAN,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(0),

    CONSTRAINT "Simulated_questions_pkey" PRIMARY KEY ("simulatedId","questionId")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_name_key" ON "Discipline"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question_categories" ADD CONSTRAINT "Question_categories_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question_categories" ADD CONSTRAINT "Question_categories_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated" ADD CONSTRAINT "Simulated_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated_questions" ADD CONSTRAINT "Simulated_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulated_questions" ADD CONSTRAINT "Simulated_questions_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
