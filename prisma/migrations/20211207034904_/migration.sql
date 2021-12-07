/*
  Warnings:

  - You are about to drop the column `student_id` on the `Location` table. All the data in the column will be lost.
  - Added the required column `email` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_student_id_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "student_id",
ADD COLUMN     "email" TEXT NOT NULL;
