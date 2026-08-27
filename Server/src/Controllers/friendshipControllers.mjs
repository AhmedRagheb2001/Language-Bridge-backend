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

//@desc Get all the friends
//@route GET /api/v1/friends
//@access Private /protected (needs an access token)
export const getAllFriends = asyncHandler (async(req,res) =>{
    // res.status(200).json({message : "Here are all of the friends"});
    
    const friendships  = await prisma.friendship.findMany({
        where : {
            OR : [
                {
                    user1Id : req.user.id,
                },
                {
                    user2Id : req.user.id
                }
            ]
        },
        select :{
            id : true,
            user1Id : true,
            user2Id : true,
            user1 :{
                select :{
                    id : true,
                    profile :{
                        select :{
                            displayName : true ,
                            profilePictureUrl : true
                        }
                    }
                }
            },
            user2 : {
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
    const friends = friendships.map(friendship => {
    const friend =
        friendship.user1Id === req.user.id
            ? friendship.user2
            : friendship.user1;

    return {
        friendshipId: friendship.id,
        ...friend
    };
});
    res.status(200).json(friends);
});

//@desc Get a specific friend
//@route GET /api/v1/friends/:friendship_id
//@access Private/protected (needs an access token)
export const getFriend = asyncHandler(async (req,res) => {
    // res.status(200).json({message : "Here is the specific friend"});
    const {friendship_id} = req.params;
    if(!friendship_id)
    {
        res.status(400);
        throw new Error ("Please enter the friendship id");
    }
    const friendshipFound = await prisma.friendship.findUnique({
        where :{id : friendship_id},
        select :{
            id : true,
            user1Id : true,
            user2Id : true,
            user1 :{
                select :{
                    id : true,
                    profile :{
                        select :{
                            displayName : true ,
                            profilePictureUrl : true
                        }
                    }
                }
            },
            user2 : {
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

    if(!friendshipFound)
    {
        res.status(404);
        throw new Error("The friendship is not found");
    }
    if(req.user.id !== friendshipFound.user1Id && req.user.id !== friendshipFound.user2Id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const friend =
        friendshipFound.user1Id === req.user.id
            ? friendshipFound.user2
            : friendshipFound.user1;

    
    res.status(200).json({
        friendshipId : friendshipFound.id,
        ...friend
    });
})

//@desc delete a specific friendship
//@route DELETE /api/v1/friends/:friendship_id
//access Private/protected (needs an access token)
export const deleteFriendship = asyncHandler(async (req, res) => {
    const { friendship_id } = req.params;

    if (!friendship_id) {
        res.status(400);
        throw new Error("Please add the friendship id");
    }

    const friendshipFound = await prisma.friendship.findUnique({
        where: {
            id: friendship_id,
        },
    });

    if (!friendshipFound) {
        res.status(404);
        throw new Error("This friendship is not found");
    }

    if (
        friendshipFound.user1Id !== req.user.id &&
        friendshipFound.user2Id !== req.user.id
    ) {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }

    await prisma.$transaction(async (tx) => {

        await tx.friendship.delete({
            where: {
                id: friendship_id,
            },
        });

        const friendRequest = await tx.friendRequest.findFirst({
            where: {
                status: "ACCEPTED",
                OR: [
                    {
                        senderId: friendshipFound.user1Id,
                        receiverId: friendshipFound.user2Id,
                    },
                    {
                        senderId: friendshipFound.user2Id,
                        receiverId: friendshipFound.user1Id,
                    },
                ],
            },
        });

        if (friendRequest) {
            await tx.friendRequest.update({
                where: {
                    id: friendRequest.id,
                },
                data: {
                    status: "CANCELED",
                },
            });
        }
    });

    res.status(200).json({
        message: "Friendship has been deleted successfully",
    });
});