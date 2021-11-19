// Create a session and create a quiz and chatroom for the session
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
    const session: Session = await prisma.session.create({
      data: {
        ...req.body.session,
        startedAt: new Date(req.body.session.startedAt),
        quiz: {
          create: {
            name: req.body.session.name + " Quiz",
          },
        },
        chat: {
          create: {
            name: req.body.session.name + " Chatroom",
          },
        },
        teacher: {
          connect: {
            email: req.body.email,
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
//     "session": {
//         "name": "Programming class 1",
//         "class_code": "WIX2001"
//     },
//     "email": "ziqinyeow@gmail.com"
// }
