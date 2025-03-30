-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" VARCHAR(40) NOT NULL DEFAULT concat('ntf_', gen_random_uuid()),
    "userId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "dibaca" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
