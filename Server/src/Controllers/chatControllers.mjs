import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({
    connectionString : process.env.DATABASE_URL
});

const prisma = new PrismaClient ({
    adapter
});

//@desc Create a new chat
//@route POST /api/v1/chats/:friend_id
//@access Private /Protected (needs an access token)
export const createChat = asyncHandler(async (req, res) => {
    const { friend_id } = req.params;

    if (!friend_id) {
        res.status(400);
        throw new Error("Please add the friend id");
    }

    const friendshipFound = await prisma.friendship.findFirst({
        where: {
            OR: [
                {
                    user1Id: req.user.id,
                    user2Id: friend_id
                },
                {
                    user1Id: friend_id,
                    user2Id: req.user.id
                }
            ]
        }
    });

    if (!friendshipFound) {
        res.status(404);
        throw new Error("You can't chat, you are not friends");
    }

    // Always keep the IDs in the same order
    const [user1Id, user2Id] = [
        req.user.id,
        friend_id
    ].sort();

    // Check if the chat already exists
    const existingChat = await prisma.chat.findUnique({
        where: {
            user1Id_user2Id: {
                user1Id,
                user2Id
            }
        }
    });

    if (existingChat) {
        return res.status(200).json(existingChat);
    }

    const newChat = await prisma.chat.create({
        data: {
            user1Id,
            user2Id
        },
        select: {
            id: true,
            user1Id: true,
            user2Id: true,

            user1: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            profilePictureUrl: true
                        }
                    }
                }
            },

            user2: {
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

    res.status(201).json(newChat);
});

//@desc Get all the chats
//@route GET /api/v1/chats/
//@access Private /Protected (needs an access token)
export const getAllChats = asyncHandler(async(req,res) =>{
    const allChats = await prisma.chat.findMany({
        where : {
            OR : [
                {
                    user1Id : req.user.id
                },
                {
                    user2Id : req.user.id
                }
            ]
        },
        select : {
            id : true,
            user1Id : true,
            user2Id : true ,
            user1 :{
                select :{
                    id : true,
                    profile :{
                        select : {
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            },
            user2 : {
                select :{
                    id : true ,
                    profile : {
                        select :{
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            }
        }
    });
    const chats = allChats.map(chat => {
    const chatFriend =
        chat.user1Id === req.user.id
            ? chat.user2
            : chat.user1;

    return {
        chatId : chat.id,
        chatFriend : chatFriend
    };
});
res.status(200).json(chats);
});

//@desc Get a specific chat
//@route GET /api/v1/chats/:chat_id
//@access Private /Protected (needs an access token)
export const getSpecificChat = asyncHandler(async(req,res) => {
    const {chat_id} = req.params;

    if(!chat_id)
    {
        res.status(400);
        throw new Error("Please add the chat id");
    }
    const chatFound = await prisma .chat.findUnique({
        where : {
            id : chat_id
        },
        select : {
            id : true,
            user1Id : true,
            user2Id : true,
            user1 :{
                select :{
                    id : true,
                    profile :{
                        select : {
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            },
            user2 :{
                select :{
                    id : true,
                    profile :{
                        select :{
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            }
        }
    });
    if(!chatFound)
    {
        res.status(404);
        throw new Error ("This chat is not found");
    }
    if(chatFound.user1Id !== req.user.id && chatFound.user2Id !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const chatFriend = chatFound.user1Id === req.user.id ? chatFound.user2 
    : chatFound.user1;
    res.status(200).json({
        chatId : chatFound.id,
        chatFriend : chatFriend
    });
})

//@desc Delete a specific chat
//@route DELETE /api/v1/chats/:chat_id
//@access Private /Protected (needs an access token)
export const deleteChat = asyncHandler (async (req,res) => {
    const {chat_id} = req.params;

    if(!chat_id)
    {
        res.status(400);
        throw new Error("Please add the chat id");
    }

    const chatFound = await prisma.chat.findUnique({
        where :{
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
    const deletedChat = await prisma.chat.delete ({
        where : {id : chat_id},
        select :{
            id : true,
        }
    });
    res.status(200).json({
        message : "This chat has been deleted successfully",
        chatId : deletedChat.id
    });
})
