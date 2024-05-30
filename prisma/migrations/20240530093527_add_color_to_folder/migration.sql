-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "specific_date" SET DEFAULT NOW() + interval '1 hour';
