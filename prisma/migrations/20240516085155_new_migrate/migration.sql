-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "specific_date" SET DEFAULT NOW() + interval '1 hour';
