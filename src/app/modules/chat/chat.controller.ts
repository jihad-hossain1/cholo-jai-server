// import { Request, Response } from "express";
// import { LocationService } from "./location.service";
// import httpStatus from "http-status";

import { Request, Response } from "express";

// const createChat = async (req: Request, res: Response) => {
//   try {
//     const data = await req.body;

//     const result = await LocationService.createNewLocation(data);

//     return res.status(httpStatus.OK).json({
//       status: "Success",
//       message: "New location added successfully",
//       result: result,
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: "Failed",
//       message: "Something went wrong while register",
//       error: error || "Internal server error",
//     });
//   }
// };
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createChat = async (req: Request, res: Response) => {
  const { senderUserId, receiverUserId } = req.body;

  if (!senderUserId) {
    console.log("senderUserId param not sent with request");
    return res.sendStatus(400);
  }

  const chat = await prisma.chat.findFirst({
    where: {
      isGroupChat: false,
      AND: [
        { users: { some: { id: receiverUserId } } },
        { users: { some: { id: senderUserId } } },
      ],
    },
    include: {
      users: {
        select: { id: true, name: true, pic: true, email: true },
      },
      latestMessage: {
        include: {
          sender: {
            select: { name: true, pic: true, email: true },
          },
        },
      },
    },
  });

  if (chat) {
    res.send(chat);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: {
        connect: [{ id: receiverUserId }, { id: senderUserId }],
      },
    };

    try {
      const createdChat = await prisma.chat.create({
        data: chatData,
        include: {
          users: true,
        },
      });

      res.status(200).send(createdChat);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};