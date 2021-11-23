// Create a chatroom with a name for a session
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Feedback } from ".prisma/client";

interface Data {
  feedback?: Feedback;
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
    const feedback: Feedback = await prisma.feedback.create({
      data: {
        rating: req.body.rating,
        text: req.body.text,
        session: {
          connect: {
            id: req.body.session_id,
          },
        },
      },
    });
    return res.status(200).json({ feedback });
  } catch (error) {
    return res.status(400).json({ message: "error" });
  }
}

// {
//      "session_id": "",
//      "rating":
//      "text": ""
// }
