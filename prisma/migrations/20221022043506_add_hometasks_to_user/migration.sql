-- AlterTable
ALTER TABLE "Hometask" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Hometask" ADD CONSTRAINT "Hometask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
