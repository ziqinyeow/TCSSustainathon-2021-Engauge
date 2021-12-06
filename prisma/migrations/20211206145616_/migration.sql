-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "endedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Teacherques" (
    "id" TEXT NOT NULL,
    "class_code" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answerScheme" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "realisedAt" TIMESTAMP(3),
    "teacher_email" TEXT NOT NULL,

    CONSTRAINT "Teacherques_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Teacherques" ADD CONSTRAINT "Teacherques_teacher_email_fkey" FOREIGN KEY ("teacher_email") REFERENCES "Teacher"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
