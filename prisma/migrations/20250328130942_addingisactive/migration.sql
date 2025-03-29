-- AlterTable
ALTER TABLE "Periode" ADD COLUMN     "isActived" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "JadwalPendaftaran" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('jdw_', gen_random_uuid()),
    "periodeId" TEXT NOT NULL,
    "pembukaan" TIMESTAMP(3) NOT NULL,
    "batas_akhir" TIMESTAMP(3) NOT NULL,
    "seleksi_mulai" TIMESTAMP(3) NOT NULL,
    "seleksi_selesai" TIMESTAMP(3) NOT NULL,
    "pengumuman_penerima" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JadwalPendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JadwalPendaftaran_periodeId_key" ON "JadwalPendaftaran"("periodeId");

-- AddForeignKey
ALTER TABLE "JadwalPendaftaran" ADD CONSTRAINT "JadwalPendaftaran_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
