// a student answer a question
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Session } from ".prisma/client";

interface Data {
  session?: Session;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Invalid" });
  }

  try {
    const session: Session = await prisma.session.update({
      where: {
        id: req.body.session_id,
      },
      data: {
        quiz: {
          update: {
            question: {
              update: {
                where: {
                  id: req.body.question_id,
                },
                data: {
                  answer: {
                    create: {
                      answer: req.body.answer,
                      student: {
                        connect: {
                          email: req.body.email,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      include: {
        quiz: {
          include: {
            question: {
              include: {
                answer: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ session });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//      "session_id": "",
//      "question_id": "",
//      "email": "", // student
//      "answer": "" // student
// }
