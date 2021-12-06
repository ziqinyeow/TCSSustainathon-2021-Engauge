// get all the teacher sessions by the teacher email
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Session } from ".prisma/client";

interface Data {
  session?: Session[];
  ended_session?: Session[];
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const result: Session[] = await prisma.teacher
      .findUnique({
        where: {
          // @ts-ignore
          email: req.query.email,
        },
      })
      .session();
    const session = result.filter((r) => !r.end);
    return res.status(200).json({ session });
  }

  try {
    if (req.method === "POST") {
      const result: Session[] = await prisma.teacher
        .findUnique({
          where: {
            email: req.body.email,
          },
        })
        .session();

      const ended_session = result.filter((r) => r.end);
      if (req.body.end) {
        return res.status(200).json({ ended_session });
      }
      const session = result.filter((r) => !r.end);
      return res.status(200).json({ session });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//     "email": "ziqinyeow@gmail.com"
//     "end": true
// }
