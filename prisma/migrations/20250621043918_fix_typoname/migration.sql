/*
  Warnings:

  - You are about to drop the column `kouta_kelulusan` on the `Periode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Periode" DROP COLUMN "kouta_kelulusan",
ADD COLUMN     "kuota_kelulusan" INTEGER;
