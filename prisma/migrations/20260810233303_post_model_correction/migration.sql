/*
  Warnings:

  - You are about to drop the column `comment` on the `posts` table. All the data in the column will be lost.
  - Added the required column `content` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT NOT NULL;
