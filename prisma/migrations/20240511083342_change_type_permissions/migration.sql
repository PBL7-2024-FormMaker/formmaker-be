/*
  Warnings:

  - Made the column `permissions` on table `forms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "permissions" SET NOT NULL;
