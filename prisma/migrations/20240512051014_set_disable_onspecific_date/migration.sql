-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "disabledOnSpecificDate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specificDate" TIMESTAMP(3) DEFAULT NOW() + interval '1 hour';
