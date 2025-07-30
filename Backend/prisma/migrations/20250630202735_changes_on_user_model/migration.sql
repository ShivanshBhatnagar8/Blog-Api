/*
  Warnings:

  - You are about to drop the column `likeBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likeBy" TEXT[],
ADD COLUMN     "likes" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "likeBy",
DROP COLUMN "likes";
