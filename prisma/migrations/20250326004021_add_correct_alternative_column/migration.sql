/*
  Warnings:

  - Added the required column `correctAlternative` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "correctAlternative" VARCHAR(1) NOT NULL;
