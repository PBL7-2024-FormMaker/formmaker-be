/*
  Warnings:

  - You are about to drop the column `disabledNotification` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `disabledOnSpecificDate` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `specificDate` on the `forms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "forms" DROP COLUMN "disabledNotification",
DROP COLUMN "disabledOnSpecificDate",
DROP COLUMN "specificDate",
ADD COLUMN     "disabled_notification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "disabled_on_specific_date" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specific_date" TIMESTAMPTZ(3) DEFAULT NOW() + interval '1 hour';
