import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();
import {createMessageSchema,updateMessageSchema} from "../Schemas/messageSchemas.mjs";
const adapter = new PrismaPg({
    connectionString : process.env.DATABASE_URL
});

const prisma = new PrismaClient ({
    adapter
});
//@decs Create a new message
//@route POST /api/v1/chats/:chat_id/messages/
//@access Private/Protected (only needs an access token)
export const createMessage = asyncHandler (async(req,res) =>{
    const {chat_id} = req.params;
    if(!chat_id)
    {
        res.status(400);
        throw new Error("Please enter the chat id");
    }
    const {error,value} = createMessageSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {content} = value;
    const chatFound = await prisma.chat.findUnique({
        where : {id : chat_id}
    });
    if(!chatFound)
    {
        res.status(404);
        throw new Error("This chat is not found");
    }
    if(chatFound.user1Id !== req.user.id && chatFound.user2Id !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const newMessage = await prisma.message.create({
    data: {
        chatId: chat_id,
        senderId: req.user.id,
        content: content
    },
    select: {
        id: true,
        chatId: true,
        senderId: true,
        content: true,
        createdAt: true,
        sender: {
            select: {
                id: true,
                profile: {
                    select: {
                        displayName: true,
                        profilePictureUrl: true
                    }
                }
            }
        }
    }
});

// Get Socket.IO instance
const io = req.app.get("io");

// Send the new message to everyone in this chat room
io.to(String(chat_id)).emit("new:message", newMessage);

res.status(201).json({
    message: "The message has been created successfully",
    newMessage: newMessage
});
});

//@decs Get all the messages of a specific chat
//@route POST /api/v1/chats/:chat_id/messages/
//@access Private/Protected (only needs an access token)
export const getAllMessages = asyncHandler (async(req,res) =>{
    const {chat_id} = req.params;
    if(!chat_id)
    {
        res.status(400);
        throw new Error("Please enter the chat id");
    }
    const chatFound = await prisma.chat.findUnique({
        where : {
            id : chat_id
        }
    });
    if(!chatFound)
    {
        res.status(404);
        throw new Error("The chat is not found");
    }
    if(chatFound.user1Id !== req.user.id && chatFound.user2Id !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const allMessages = await prisma.message.findMany({
        where : {
            chatId : chat_id
        },
        select :{
            id : true,
            chatId : true,
            senderId : true,
            content : true,
            createdAt : true,
            updatedAt : true,
            sender : {
                select :{
                    id : true,
                    profile :{
                        select : {
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            }
        }
    });
    res.status(200).json({
        message : "Here are all the messages of this chat",
        allMessages : allMessages
    });
})

//@decs Update a specific message of a specific chat
//@route PATCH /api/v1/chats/:chat_id/messages/:message_id
//@access Private/Protected (only needs an access token)
export const updateMessage = asyncHandler (async(req,res) => {
    const {chat_id,message_id} = req.params;
    if(!chat_id || !message_id)
    {
        res.status(400);
        throw new Error("Please enter the chat id and the message id");
    }
    const {error,value} = updateMessageSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {content} = value;
    if(!content || content.length === 0)
    {
        res.status(400);
        throw new Error("Please enter a content");
    }
    const chatFound = await prisma.chat.findUnique({
        where : {
            id : chat_id
        }
    });
    if(!chatFound)
    {
        res.status(404);
        throw new Error("This chat is not found");
    }
    if(chatFound.user1Id !== req.user.id && chatFound.user2Id !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const messageFound = await prisma.message.findUnique({
        where : {
            id : message_id
        }
    });
    if(!messageFound)
    {
        res.status(404);
        throw new Error("This message is not found");
    }
    if(messageFound.senderId !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action, because you aren't the sender");
    }

    const updatedMessage = await prisma.message.update({
        where : {
            id : message_id
        },
        data : {
            content : content
        },
        select :{
            id : true,
            chatId : true,
            senderId : true,
            content : true,
            updatedAt : true,
            createdAt : true,
            sender : {
                select :{
                    id : true ,
                    profile :{
                        select : {
                            displayName : true,
                            profilePictureUrl : true,
                        }
                    }
                }
            }
        }
    });
    res.status(200).json({
        messsage : "The message has been updated successfully",
        updatedMessage : updatedMessage
    });
});

//@decs Delete a specific message of a specific chat
//@route POST /api/v1/chats/:chat_id/messages/:message_id
//@access Private/Protected (only needs an access token)
export const deleteMessage = asyncHandler (async(req,res) => {
    const {chat_id,message_id} = req.params;
    if(!chat_id || !message_id)
    {
        res.status(400);
        throw new Error("Please enter the chat id and the message id");
    }
    const chatFound = await prisma.chat.findUnique({
        where : {
            id : chat_id
        }
    });
    if(!chatFound)
    {
        res.status(404);
        throw new Error("This chat is not found");
    }
    if(chatFound.user1Id !== req.user.id && chatFound.user2Id !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const messageFound = await prisma.message.findUnique({
        where : {
            id : message_id
        }
    });
    if(!messageFound)
    {
        res.status(404);
        throw new Error("This message is not found");
    }
    if(messageFound.senderId !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action, because you aren't the sender");
    }
    const deletedMessage = await prisma.message.delete({
        where : {
            id : message_id
        }
    });
    res.status(200).json({
        message : "This message has been deleted successfully"
    });
})