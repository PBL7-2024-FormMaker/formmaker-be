/*
  Warnings:

  - You are about to drop the column `answers` on the `responses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "responses" DROP COLUMN "answers",
ADD COLUMN     "formAnswers" JSONB[];
