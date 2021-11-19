// Join the student email with a session
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
        student: {
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
//     "session_id": ""
//     "email": "" // student
// }
