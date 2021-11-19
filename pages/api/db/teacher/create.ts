import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Teacher } from ".prisma/client";

interface Data {
  teacher?: Teacher;
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
    const teacher: Teacher = await prisma.teacher.upsert({
      where: { email: req.body.email || 0 },
      update: {},
      create: {
        email: req.body.email,
      },
    });
    return res.status(200).json({ teacher });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// {
//     "email": "ziqinyeow@gmail.com"
// }
