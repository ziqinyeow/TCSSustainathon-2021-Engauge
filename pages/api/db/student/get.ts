// get a list of students based on the session
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Student } from ".prisma/client";

interface Data {
  student?: Student[];
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
    const student: Student[] = await prisma.session
      .findUnique({
        where: {
          id: req.body.session_id,
        },
      })
      .student();
    return res.status(200).json({ student });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//      "session_id": "",
// }
