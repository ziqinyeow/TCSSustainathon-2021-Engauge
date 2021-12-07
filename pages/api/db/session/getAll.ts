// get all the session info until quiz and chatroom detail by session id
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
    const session: any = await prisma.session.findUnique({
      where: {
        id: req.body.session_id,
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
        chat: {
          include: {
            message: true,
          },
        },
        student: true,
        feedback: true,
        location: true,
      },
    });
    return res.status(200).json({ session });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//     "session_id": ""
// }
