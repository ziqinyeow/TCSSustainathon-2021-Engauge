import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Quiz } from ".prisma/client";

interface Data {
  quiz?: Quiz;
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
    const quiz: Quiz = await prisma.quiz.create({
      data: {
        name: req.body.name,
        session: {
          connect: {
            id: req.body.session_id,
          },
        },
      },
    });
    return res.status(200).json({ quiz });
  } catch (error) {
    return res.status(400).json({ message: "error" });
  }
}

// {
//     "session_id": "",
//      "name": ""
// }
