import { Request, Response } from "express";

const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let newMessage = await prisma.message.create({
      data: {
        content: content,
        chat: { connect: { id: chatId } },
        // sender: { connect: { id: req.id } },
      },
      include: {
        sender: { select: { id: true, name: true, pic: true } },
        chat: {
          include: {
            users: { select: { id: true, name: true, pic: true, email: true } },
          },
        },
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { latestMessage: { connect: { id: newMessage.id } } },
    });

    res.json(newMessage);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: req.params.chatId },
      include: {
        sender: { select: { id: true, name: true, pic: true, email: true } },
        chat: true,
      },
    });

    res.json(messages);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
