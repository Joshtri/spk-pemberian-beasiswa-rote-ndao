-- DropForeignKey
ALTER TABLE "CalonPenerima" DROP CONSTRAINT "CalonPenerima_userId_fkey";

-- AlterTable
ALTER TABLE "CalonPenerima" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CalonPenerima" ADD CONSTRAINT "CalonPenerima_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
