import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Teacherques } from ".prisma/client";

interface Data {
  question?: Teacherques;
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
    const question: Teacherques = await prisma.teacherques.create({
      data: {
        question: req.body.question,
        class_code: req.body.class_code,
        answerScheme: req.body.answerScheme,
        url: req.body.url,
        teacher: {
          connect: {
            email: req.body.email,
          },
        },
      },
    });
    return res.status(200).json({ question });
  } catch (error) {
    return res.status(400).json({ message: "error" });
  }
}

// {
//     "email": "",
//     "url": "",
//     "class_code": "",
//      "question": "",
//      "answerScheme": ""
// }
