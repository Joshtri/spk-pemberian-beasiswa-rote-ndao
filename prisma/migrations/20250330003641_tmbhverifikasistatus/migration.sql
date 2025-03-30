-- CreateEnum
CREATE TYPE "VerifikasiStatus" AS ENUM ('PENDING', 'DITERIMA', 'DITOLAK');

-- AlterTable
ALTER TABLE "Penilaian" ADD COLUMN     "verifikasiStatus" "VerifikasiStatus" NOT NULL DEFAULT 'PENDING';
