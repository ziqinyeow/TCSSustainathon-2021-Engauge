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
    await prisma.session.update({
      where: {
        id: req.body.session_id,
      },
      data: {
        end: true,
      },
    });
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//     "session": ""
// }
