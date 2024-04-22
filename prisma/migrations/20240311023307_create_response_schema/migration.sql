/*
  Warnings:

  - Made the column `total_submissions` on table `forms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "total_submissions" SET NOT NULL;

-- CreateTable
CREATE TABLE "responses" (
    "id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "answers" JSONB[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
