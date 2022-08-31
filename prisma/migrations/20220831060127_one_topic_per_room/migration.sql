/*
  Warnings:

  - You are about to drop the `TopicsInRooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TopicsInRooms" DROP CONSTRAINT "TopicsInRooms_roomId_fkey";

-- DropForeignKey
ALTER TABLE "TopicsInRooms" DROP CONSTRAINT "TopicsInRooms_topicId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "topicId" TEXT;

-- DropTable
DROP TABLE "TopicsInRooms";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
