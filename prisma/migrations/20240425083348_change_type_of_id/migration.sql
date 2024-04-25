/*
  Warnings:

  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `forms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `responses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `folders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `forms` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `responses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_FavouriteForms" DROP CONSTRAINT "_FavouriteForms_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavouriteForms" DROP CONSTRAINT "_FavouriteForms_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_teamId_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_team_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_form_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_creator_id_fkey";

-- AlterTable
ALTER TABLE "_FavouriteForms" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_TeamMembers" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "creator_id" SET DATA TYPE TEXT,
ALTER COLUMN "teamId" SET DATA TYPE TEXT,
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "folders_id_seq";

-- AlterTable
ALTER TABLE "forms" DROP CONSTRAINT "forms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "creator_id" SET DATA TYPE TEXT,
ALTER COLUMN "folder_id" SET DATA TYPE TEXT,
ALTER COLUMN "team_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "forms_id_seq";

-- AlterTable
ALTER TABLE "responses" DROP CONSTRAINT "responses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "form_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "responses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "responses_id_seq";

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "creator_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "teams_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "folders_id_key" ON "folders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "forms_id_key" ON "forms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "responses_id_key" ON "responses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_id_key" ON "teams"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouriteForms" ADD CONSTRAINT "_FavouriteForms_A_fkey" FOREIGN KEY ("A") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouriteForms" ADD CONSTRAINT "_FavouriteForms_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
