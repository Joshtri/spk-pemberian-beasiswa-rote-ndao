-- CreateEnum
CREATE TYPE "TipeDokumen" AS ENUM ('KHS', 'KRS', 'UKT', 'PRESTASI');

-- CreateTable
CREATE TABLE "DokumenPenilaian" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('dpn_', gen_random_uuid()),
    "penilaianId" TEXT NOT NULL,
    "tipe_dokumen" "TipeDokumen" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DokumenPenilaian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DokumenPenilaian" ADD CONSTRAINT "DokumenPenilaian_penilaianId_fkey" FOREIGN KEY ("penilaianId") REFERENCES "Penilaian"("id") ON DELETE CASCADE ON UPDATE CASCADE;
