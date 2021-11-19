import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Student } from ".prisma/client";

interface Data {
  student?: Student;
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
    const student: Student = await prisma.student.upsert({
      where: { email: req.body.email || 0 },
      update: {},
      create: req.body,
    });
    return res.status(200).json({ student });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//      "email": "ziqinyeow@gmail.com",
//      "name": "" //optional
//      "password": ""
// }
