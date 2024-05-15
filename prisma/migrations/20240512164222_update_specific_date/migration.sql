/*
  Warnings:

  - Made the column `specific_date` on table `forms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "specific_date" SET NOT NULL,
ALTER COLUMN "specific_date" SET DEFAULT NOW() + interval '1 hour';
