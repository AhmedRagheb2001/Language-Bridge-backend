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

//@desc Create/Send a friend request
//@route POST  /api/v1/friend-requests
//@access private/protected(needs an access token only)
export const createFriendRequest = asyncHandler(async(req,res) => {
    // res.status(201).json({message :"A new friend request has been created successfully"});
    const {receiver_id}= req.params;
    if(!receiver_id)
    {
        res.status(400);
        throw new Error("Plesae add the receiver id");
    }
        if (receiver_id === req.user.id) {
        res.status(400);
        throw new Error("You cannot send a friend request to yourself");
    }
    const friendRequestFound = await prisma.friendRequest.findFirst({
    where: {
        status: {
        in: ["PENDING", "ACCEPTED"],
        },
        OR: [
        {
            senderId: req.user.id,
            receiverId: receiver_id
        },
        {
            senderId: receiver_id,
            receiverId: req.user.id,
        },
        ],
    },
    });
    
    if (friendRequestFound) {
        res.status(409);

        if (friendRequestFound.status === "ACCEPTED") {
            throw new Error("You are already friends with this user");
        }

        throw new Error("A pending friend request already exists");
    }
    const newFriendRequest = await prisma.friendRequest.create({
        data :{
            senderId : req.user.id,
            receiverId : receiver_id
        },
        select : {
            id : true,
            senderId : true,
            receiverId : true,
            status:true,
            sender :{
                select :{
                    profile : {
                        select :{
                            displayName : true,
                            profilePictureUrl : true,
                        }
                    }
                }
            },
            receiver :{
                select :{
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
    res.status(201).json(newFriendRequest)
})


//@desc Get all the sent friend requests
//@route GET  /api/v1/friend-requests/sent
//@access private/protected(needs an access token only, and the user must be the sender of these friend requests)
export const getAllSentFriendRequests = asyncHandler(async (req,res) => {
    // res.status(200).json({message : "These are all the sent friend requests"});
    const allSentFriendRequests = await prisma.friendRequest.findMany({
        where : {
            senderId : req.user.id
        },
        orderBy: {
        createdAt: "desc"
    },
        select :{
            id : true,
            senderId : true,
            receiverId :true,
            status : true,
            createdAt : true,
            receiver :{
                select : {
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
    res.status(200).json(allSentFriendRequests);
})



//@desc Get all the received friend requests
//@route GET  /api/v1/friend-requests/received
//@access private/protected(needs an access token only, and the user must be the receiver of these friend requests)
export const getAllReceivedFriendRequests = asyncHandler (async (req,res) =>{
    // res.status(200).json({message : "These are all the received friend requests"});
    const allReceivedFriendRequests =  await prisma.friendRequest.findMany({
        where : {
            receiverId : req.user.id
        },
        orderBy: {
        createdAt: "desc"
    },
        select :{
            id : true,
            senderId : true,
            receiverId :true,
            status : true,
            createdAt : true,
            sender :{
                select : {
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
    res.status(200).json(allReceivedFriendRequests);
})


//@desc Accept a specific friend request
//@route PATCH /api/v1/friend-requests/:friendRequest_id/accept
//@access private/protected
export const acceptFriendRequest = asyncHandler(async (req, res) => {
    const { friendRequest_id } = req.params;

    if (!friendRequest_id) {
        res.status(400);
        throw new Error("Please add the friend request id");
    }

    // 1. Find the friend request
    const friendRequestFound = await prisma.friendRequest.findUnique({
        where: {
            id: friendRequest_id,
        },
    });

    if (!friendRequestFound) {
        res.status(404);
        throw new Error("This friend request was not found");
    }

    // 2. Make sure the logged-in user is the receiver
    if (friendRequestFound.receiverId !== req.user.id) {
        res.status(403);
        throw new Error("You don't have permission to accept this friend request");
    }

    // 3. Make sure the request is still pending
    if (friendRequestFound.status !== "PENDING") {
        res.status(409);

        if (friendRequestFound.status === "ACCEPTED") {
            throw new Error("This friend request is already accepted");
        }

        if (friendRequestFound.status === "REJECTED") {
            throw new Error("This friend request is already rejected");
        }

        if (friendRequestFound.status === "CANCELED") {
            throw new Error("This friend request is already canceled");
        }
    }

    // 4. Create the friendship + accept request atomically
    const result = await prisma.$transaction(async (tx) => {
        // Always store the smaller user ID as user1Id.
        // This makes A-B and B-A represent the same friendship.
        const [user1Id, user2Id] =
            friendRequestFound.senderId < friendRequestFound.receiverId
                ? [
                    friendRequestFound.senderId,
                    friendRequestFound.receiverId,
                ]
                : [
                    friendRequestFound.receiverId,
                    friendRequestFound.senderId,
                ];

        // 5. Update friend request
        const acceptedFriendRequest = await tx.friendRequest.update({
            where: {
                id: friendRequest_id,
            },
            data: {
                status: "ACCEPTED",
            },
            select: {
                id: true,
                senderId: true,
                receiverId: true,
                status: true,
                createdAt: true,
                updatedAt: true,

                sender: {
                    select: {
                        profile: {
                            select: {
                                displayName: true,
                                profilePictureUrl: true,
                            },
                        },
                    },
                },

                receiver: {
                    select: {
                        profile: {
                            select: {
                                displayName: true,
                                profilePictureUrl: true,
                            },
                        },
                    },
                },
            },
        });

        // 6. Create friendship
        const friendship = await tx.friendship.create({
            data: {
                user1Id,
                user2Id,
            },
        });

        return {
            acceptedFriendRequest,
            friendship,
        };
    });

    // 7. Send response
    res.status(200).json({
        message: "The friend request has been accepted successfully",
        ...result,
    });
});
//@desc Reject a specific friend request
//@route PATCH  /api/v1/friend-requests/:friendRequest_id/reject
//@access private/protected(needs an access token only, and the user must be the receiver of this friend request)
export const rejectFriendRequest = asyncHandler (async (req,res) =>{
    // res.status(200).json({message : "The friend request has been rejected successfully"});
    const {friendRequest_id} = req.params;
    if(!friendRequest_id){
        res.status(400);
        throw new Error("Please add the friend request id");
    }
    const friendRequestFound = await prisma.friendRequest.findUnique({
        where : {
            id : friendRequest_id
        }
    });
    if(!friendRequestFound)
    {
        res.status(404);
        throw new Error("This friend request is not found");
    }
    if(friendRequestFound.receiverId !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    if(friendRequestFound.status !== "PENDING")
    {
        res.status(409);
        if(friendRequestFound.status === "REJECTED")
        {
            throw new Error ("This friend request is already rejected");
        }
        if(friendRequestFound.status === "ACCEPTED"){
            throw new Error("This friend request is already accepted");
        }
        if (friendRequestFound.status === "CANCELED"){
            throw new Error ("This friend request is already canceled ");
        }

    }

    const rejectedFriendRequest = await prisma.friendRequest.update ({
        where : {
            id : friendRequest_id
        },
        data :{
            status : "REJECTED"
        },
        select : {
            id : true,
            senderId : true,
            receiverId : true,
            status:true,
            sender :{
                select :{
                    profile : {
                        select :{
                            displayName : true,
                            profilePictureUrl : true,
                        }
                    }
                }
            },
            receiver :{
                select :{
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
        message : "The friendRequest has been rejected successfully",
        rejectedFriendRequest
    });
})

//@desc Cancel a specific friend request
//@route PATCH  /api/v1/friend-requests/:friendRequest_id/cancel
//@access private/protected(needs an access token only, and the user must be the sender of this friend request)
export const cancelFriendRequest = asyncHandler (async (req,res) =>{
    // res.status(200).json({message : "The friend request has been canceled successfully"});
    const {friendRequest_id} = req.params;
    if(!friendRequest_id){
        res.status(400);
        throw new Error("Please add the friend request id");
    }
    const friendRequestFound = await prisma.friendRequest.findUnique({
        where : {
            id : friendRequest_id
        }
    });
    if(!friendRequestFound)
    {
        res.status(404);
        throw new Error("This friend request is not found");
    }
    if(friendRequestFound.senderId !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    if(friendRequestFound.status !== "PENDING")
    {
        res.status(409);
        if(friendRequestFound.status === "REJECTED")
        {
            throw new Error ("This friend request is already rejected");
        }
        if(friendRequestFound.status === "ACCEPTED"){
            throw new Error("This friend request is already accepted");
        }
        if (friendRequestFound.status === "CANCELED"){
            throw new Error ("This friend request is already canceled ");
        }

    }

    const canceledFriendRequest = await prisma.friendRequest.update ({
        where : {
            id : friendRequest_id
        },
        data :{
            status : "CANCELED"
        },
        select : {
            id : true,
            senderId : true,
            receiverId : true,
            status:true,
            sender :{
                select :{
                    profile : {
                        select :{
                            displayName : true,
                            profilePictureUrl : true,
                        }
                    }
                }
            },
            receiver :{
                select :{
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
        message : "This friend request has been canceled successfully",
        canceledFriendRequest
    })

})

//@desc Delete a specific friend request
//@route DELETE  /api/v1/friend-requests/:friendRequest_id
//@access private/protected(needs an access token only, and the user must be the sender of this friend request)
export const deleteFriendRequest = asyncHandler (async (req,res) =>{
    // res.status(200).json({message : "The friend request has been deleted successfully"});
    const {friendRequest_id} = req.params;
    if(!friendRequest_id)
    {
        res.status(400);
        throw new Error("Please add the friend request id");
    }
    const friendRequestFound = await prisma.friendRequest.findUnique({
        where : {id : friendRequest_id}
    });
    if(!friendRequestFound)
    {
        res.status(404);
        throw new Error("This friend request is not found");
    }
    if(friendRequestFound.senderId !== req.user.id)
    {
        res.status(403);
        throw new Error("You are not allowed to do this action");
    }
    const deletedFriendRequest = await prisma.friendRequest.delete({
        where : {
            id : friendRequest_id,
            senderId : req.user.id
        }
    });
    res.status(200).json({message : "This friend request has been deleted successfully"});
})