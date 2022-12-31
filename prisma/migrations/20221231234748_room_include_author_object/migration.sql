/*
  Warnings:

  - You are about to drop the column `authorImage` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `authorName` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "authorImage",
DROP COLUMN "authorName";
