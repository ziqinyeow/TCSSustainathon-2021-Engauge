/*
  Warnings:

  - You are about to drop the column `student_id` on the `Answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_student_id_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "student_id",
ADD COLUMN     "student_email" TEXT;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_student_email_fkey" FOREIGN KEY ("student_email") REFERENCES "Student"("email") ON DELETE SET NULL ON UPDATE CASCADE;
