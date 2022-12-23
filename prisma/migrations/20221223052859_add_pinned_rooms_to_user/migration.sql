-- CreateTable
CREATE TABLE "PinnedRoom" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PinnedRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PinnedRoom" ADD CONSTRAINT "PinnedRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedRoom" ADD CONSTRAINT "PinnedRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
