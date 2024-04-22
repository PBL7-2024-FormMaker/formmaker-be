-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "color" TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "forms" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "logo_url" TEXT,
    "settings" JSONB NOT NULL,
    "total_submissions" INTEGER DEFAULT 0,
    "elements" JSONB[],
    "permissions" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),
    "creator_id" INTEGER NOT NULL,
    "folder_id" INTEGER,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FavouriteForms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavouriteForms_AB_unique" ON "_FavouriteForms"("A", "B");

-- CreateIndex
CREATE INDEX "_FavouriteForms_B_index" ON "_FavouriteForms"("B");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouriteForms" ADD CONSTRAINT "_FavouriteForms_A_fkey" FOREIGN KEY ("A") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouriteForms" ADD CONSTRAINT "_FavouriteForms_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
