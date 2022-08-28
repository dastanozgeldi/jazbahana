/*
  Warnings:

  - You are about to drop the column `userImage` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "userImage",
DROP COLUMN "userName",
ADD COLUMN     "authorImage" TEXT,
ADD COLUMN     "authorName" TEXT;
