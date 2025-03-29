-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KEPALA_BIDANG', 'CALON_PENERIMA');

-- CreateEnum
CREATE TYPE "TipeKriteria" AS ENUM ('BENEFIT', 'COST');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('usr_', gen_random_uuid()),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalonPenerima" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('cln_', gen_random_uuid()),
    "userId" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "tanggal_lahir" TEXT NOT NULL,
    "rt_rw" TEXT NOT NULL,
    "kelurahan_desa" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "perguruan_Tinggi" TEXT NOT NULL,
    "fakultas_prodi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalonPenerima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kriteria" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('krt_', gen_random_uuid()),
    "nama_kriteria" TEXT NOT NULL,
    "bobot_kriteria" DOUBLE PRECISION NOT NULL,
    "tipe_kriteria" "TipeKriteria" NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubKriteria" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('skr_', gen_random_uuid()),
    "kriteriaId" TEXT NOT NULL,
    "nama_sub_kriteria" TEXT NOT NULL,
    "bobot_sub_kriteria" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubKriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penilaian" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('pnl_', gen_random_uuid()),
    "calonPenerimaId" TEXT NOT NULL,
    "sub_kriteriaId" TEXT NOT NULL,
    "kriteriaId" TEXT NOT NULL,
    "periodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasilPerhitungan" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('hsl_', gen_random_uuid()),
    "calonPenerimaId" TEXT NOT NULL,
    "nilai_akhir" DECIMAL(10,4) NOT NULL,
    "periodeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rangking" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HasilPerhitungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periode" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('prd_', gen_random_uuid()),
    "nama_periode" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Periode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CalonPenerima" ADD CONSTRAINT "CalonPenerima_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubKriteria" ADD CONSTRAINT "SubKriteria_kriteriaId_fkey" FOREIGN KEY ("kriteriaId") REFERENCES "Kriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_calonPenerimaId_fkey" FOREIGN KEY ("calonPenerimaId") REFERENCES "CalonPenerima"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_sub_kriteriaId_fkey" FOREIGN KEY ("sub_kriteriaId") REFERENCES "SubKriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_kriteriaId_fkey" FOREIGN KEY ("kriteriaId") REFERENCES "Kriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilPerhitungan" ADD CONSTRAINT "HasilPerhitungan_calonPenerimaId_fkey" FOREIGN KEY ("calonPenerimaId") REFERENCES "CalonPenerima"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilPerhitungan" ADD CONSTRAINT "HasilPerhitungan_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
