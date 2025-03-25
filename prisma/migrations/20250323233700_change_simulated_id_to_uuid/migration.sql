/*
  Warnings:

  - The primary key for the `Simulated` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SimulatedQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Simulated` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `simulatedId` on the `SimulatedEssayScore` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `simulatedId` on the `SimulatedQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "SimulatedEssayScore" DROP CONSTRAINT "SimulatedEssayScore_simulatedId_fkey";

-- DropForeignKey
ALTER TABLE "SimulatedQuestion" DROP CONSTRAINT "SimulatedQuestion_simulatedId_fkey";

-- AlterTable
ALTER TABLE "Simulated" DROP CONSTRAINT "Simulated_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Simulated_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SimulatedEssayScore" DROP COLUMN "simulatedId",
ADD COLUMN     "simulatedId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "SimulatedQuestion" DROP CONSTRAINT "SimulatedQuestion_pkey",
DROP COLUMN "simulatedId",
ADD COLUMN     "simulatedId" UUID NOT NULL,
ADD CONSTRAINT "SimulatedQuestion_pkey" PRIMARY KEY ("simulatedId", "questionId");

-- AddForeignKey
ALTER TABLE "SimulatedQuestion" ADD CONSTRAINT "SimulatedQuestion_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatedEssayScore" ADD CONSTRAINT "SimulatedEssayScore_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES "Simulated"("id") ON DELETE CASCADE ON UPDATE CASCADE;
