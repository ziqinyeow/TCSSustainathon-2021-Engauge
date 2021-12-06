import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Teacherques } from ".prisma/client";

interface Data {
  question?: Teacherques[];
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // if (req.method !== "POST") {
  //   return res.status(400).json({ message: "Invalid" });
  // }

  try {
    const question: Teacherques[] = await prisma.teacherques.findMany({
      where: {
        teacher: {
          // @ts-ignore
          email: req.query.email,
        },
      },
    });
    return res.status(200).json({ question });
  } catch (error) {
    // console.log(error.message);

    return res.status(400).json({ message: "error" });
  }
}

// {
//     "session_id": "",
//     "email": "",
//     "url": "",
//      "question": "",
//      "answerScheme": ""
// }
