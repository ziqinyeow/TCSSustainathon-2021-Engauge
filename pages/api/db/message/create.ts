// Create a message sent by student using session_id

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
    const chatroom: Chatroom = await prisma.chatroom.update({
      where: {
        session_id: req.body.session_id,
      },
      data: {
        message: {
          create: {
            sender: req.body.sender,
            text: req.body.text,
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
//      "sender": "",
//      "text": "",
// }

// const sendRequest = async () => {
//   const response = await fetch(
//     `https://sustainathon.vercel.app/api/db/message/get/?session_id=${sessionID}`
//   );

//   const dt = await response.json();

//   setData(dt.chat);
// };

// let timer;

// useEffect(() => {
//   sendRequest();

//   timer = setInterval(() => {
//     sendRequest();
//   }, 10000);

//   return () => {
//     clearInterval(timer);
//   };
// }, []);
