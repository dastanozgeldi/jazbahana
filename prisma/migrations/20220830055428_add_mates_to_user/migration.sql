-- CreateTable
CREATE TABLE "_mates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_mates_AB_unique" ON "_mates"("A", "B");

-- CreateIndex
CREATE INDEX "_mates_B_index" ON "_mates"("B");

-- AddForeignKey
ALTER TABLE "_mates" ADD CONSTRAINT "_mates_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mates" ADD CONSTRAINT "_mates_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
