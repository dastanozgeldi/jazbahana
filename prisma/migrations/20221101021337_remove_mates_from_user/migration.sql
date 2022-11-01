/*
  Warnings:

  - You are about to drop the `_mates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_mates" DROP CONSTRAINT "_mates_A_fkey";

-- DropForeignKey
ALTER TABLE "_mates" DROP CONSTRAINT "_mates_B_fkey";

-- DropTable
DROP TABLE "_mates";
