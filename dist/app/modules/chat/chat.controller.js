"use strict";
// import { Request, Response } from "express";
// import { LocationService } from "./location.service";
// import httpStatus from "http-status";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderUserId, receiverUserId } = req.body;
    if (!senderUserId) {
        console.log("senderUserId param not sent with request");
        return res.sendStatus(400);
    }
    const chat = yield prisma.chat.findFirst({
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
    }
    else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: {
                connect: [{ id: receiverUserId }, { id: senderUserId }],
            },
        };
        try {
            const createdChat = yield prisma.chat.create({
                data: chatData,
                include: {
                    users: true,
                },
            });
            res.status(200).send(createdChat);
        }
        catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});
