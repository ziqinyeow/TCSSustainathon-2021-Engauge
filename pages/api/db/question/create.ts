import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Question } from ".prisma/client";

interface Data {
  question?: Question;
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
    const question: Question = await prisma.question.create({
      data: {
        question: req.body.question,
        answerScheme: req.body.answerScheme,
        quiz: {
          connect: {
            session_id: req.body.session_id,
          },
        },
      },
    });
    return res.status(200).json({ question });
  } catch (error) {
    // console.log(error.message);

    return res.status(400).json({ message: "error" });
  }
}

// {
//     "session_id": "",
//      "question": "",
//      "answerScheme": ""
// }
