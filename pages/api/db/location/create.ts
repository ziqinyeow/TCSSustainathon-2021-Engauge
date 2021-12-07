// Create a chatroom with a name for a session
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Location } from ".prisma/client";

interface Data {
  location?: Location;
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
    const location: Location = await prisma.location.create({
      data: {
        lattitude: req.body.lattitude,
        longitude: req.body.longitude,
        email: req.body.email,
        session: {
          connect: {
            id: req.body.session_id,
          },
        },
      },
    });
    return res.status(200).json({ location });
  } catch (error) {
    return res.status(400).json({ message: "error" });
  }
}

// {
//      "longitude": "",
//      "lattitude": "",
//      "email": "",
//      "session_id": "",
// }
