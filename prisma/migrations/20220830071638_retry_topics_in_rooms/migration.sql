/*
  Warnings:

  - The primary key for the `TopicsInRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TopicsInRooms" DROP CONSTRAINT "TopicsInRooms_pkey",
ADD CONSTRAINT "TopicsInRooms_pkey" PRIMARY KEY ("roomId", "topicId");
