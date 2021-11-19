// Create a chatroom with a name for a session
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Chatroom } from ".prisma/client";

interface Data {
  chatroom?: Chatroom;
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
    const chatroom: Chatroom = await prisma.chatroom.create({
      data: {
        name: req.body.name,
        session: {
          connect: {
            id: req.body.session_id,
          },
        },
      },
    });
    return res.status(200).json({ chatroom });
  } catch (error) {
    return res.status(400).json({ message: "error" });
  }
}

// {
//      "session_id": "",
//      "name": ""
// }
