// Get all messages based on the session id
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Message } from ".prisma/client";

interface Data {
  chat?: Message[];
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //   if (req.method !== "GET") {
  //     return res.status(400).json({ message: "Invalid" });
  //   }

  try {
    const chat: Message[] = await prisma.session
      .findUnique({
        where: {
          // @ts-ignore
          id: req.query.session_id,
        },
      })
      .chat()
      .message();

    return res.status(200).json({ chat });
  } catch (error) {
    return res.status(400).json({ message: "Invalid" });
  }
}

// const {data} = useSWR(`${url}/api/db/message/get/?session_id=${}`, fetcher)
