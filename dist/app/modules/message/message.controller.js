"use strict";
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
const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendMessage = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    try {
        let newMessage = yield prisma.message.create({
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
        yield prisma.chat.update({
            where: { id: chatId },
            data: { latestMessage: { connect: { id: newMessage.id } } },
        });
        res.json(newMessage);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));
const allMessages = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield prisma.message.findMany({
            where: { chatId: req.params.chatId },
            include: {
                sender: { select: { id: true, name: true, pic: true, email: true } },
                chat: true,
            },
        });
        res.json(messages);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}));
module.exports = { sendMessage, allMessages };
