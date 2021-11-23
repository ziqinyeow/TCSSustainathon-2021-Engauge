/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Location` table. All the data in the column will be lost.
  - Added the required column `session_id` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_studentId_fkey";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "sessionId",
ADD COLUMN     "session_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "studentId",
ADD COLUMN     "student_id" TEXT;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
