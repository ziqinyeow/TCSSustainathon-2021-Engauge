// get a list of questions based on the session id
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Question } from ".prisma/client";

interface Data {
  question?: Question[];
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
    const question: Question[] = await prisma.session
      .findUnique({
        where: {
          id: req.body.session_id,
        },
      })
      .quiz()
      .question();
    return res.status(200).json({ question });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//     "session_id": ""
// }
