import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();
import {updatingUserSchema} from "../Schemas/userSchemas.mjs";
const adapter = new PrismaPg({
    connectionString : process.env.DATABASE_URL
});

const prisma = new PrismaClient ({
    adapter
});

//@desc Get all the users
//@route GET /api/v1/users/
//@access private 
export const getAllUsers = asyncHandler(async(req,res) => {
    if(req.user.role !== "ADMIN")
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const allUsers = await prisma.user.findMany({
        select : {
            id : true,
            username : true,
            email : true,
            role : true,
            createdAt : true
        }
    });
    res.status(200).json({
        message : "Here are all the users",
        allUsers : allUsers
    });
})

//@desc Get a specific user
//@route GET /api/v1/users/:user_id
//@access private 
export const getSpecificUser = asyncHandler(async(req,res)=> {
    const {user_id} = req.params;
    if(!user_id)
    {
        res.status(400);
        throw new Error("Please enter the user id");
    }
    if(req.user.role !== "ADMIN" && req.user.id !== user_id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    const userFound = await prisma.user.findUnique({
        where : {
            id : user_id,
        },
        select : {
            id : true ,
            username : true,
            email : true,
            role : true,
            createdAt : true
        }
    });
    if(!userFound)
    {
        res.status(404);
        throw new Error("The user is not found");
    }
    res.status(200).json({
        message : "Here is the user info ",
        userFound : userFound
    });
});

//@desc Update the user information 
//@route PATCH /api/v1/users/:user_id
//@access private (just jwt validation no need for permissions validation)
export const updateUser = asyncHandler(async (req,res) =>{
    const {user_id} = req.params;
    if(!user_id){
        res.status(400);
        throw new Error("Please enter the user id");
    }
    const {error,value} = updatingUserSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const{username ,email} = value;
    const userFound = await prisma.user.findUnique({
        where : {
            id : user_id
        }
    });
    if(!userFound)
    {
        res.status(404);
        throw new Error("The user is not found");
    }
    if(userFound.id !== req.user.id && req.user.role !== "ADMIN")
    {
        res.status(403);
        throw new Error("You don't have permissions to do this");
    }
    const updatedUser = await prisma.user.update ({
        where : {
            id : user_id
        },
        data:{
            username : username ,
            email : email
        },
        select :{
            id : true ,
            username : true,
            email : true,
            role : true,
            createdAt : true,
            updatedAt : true
        }
    });
    res.status(200).json({
        message : "Here is the updated user info",
        updatedUser : updatedUser
    });
})


//@desc Delete a user account
//@route DELETE /api/v1/users/:user_id
//@access private (needs jwt validation and role validation)
export const deleteUser = asyncHandler(async (req, res) => {

    const { user_id } = req.params;

    if (!user_id) {
        res.status(400);
        throw new Error("Please enter the user id");
    }

    const userFound = await prisma.user.findUnique({
        where: {
            id: user_id
        },
        select: {
            id: true,
            profile: {
                select: {
                    profilePicturePublicId: true
                }
            },
            posts: {
                select: {
                    postPicturePublicId: true
                }
            }
        }
    });

    if (!userFound) {
        res.status(404);
        throw new Error("The user is not found");
    }

    if (req.user.role !== "ADMIN" && req.user.id !== user_id) {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }

    // Delete profile picture from Cloudinary
    if (userFound.profile?.profilePicturePublicId) {
        await deleteFromCloudinary(
            userFound.profile.profilePicturePublicId
        );
    }

    // Delete all post pictures from Cloudinary
    for (const post of userFound.posts) {
        if (post.postPicturePublicId) {
            await deleteFromCloudinary(
                post.postPicturePublicId
            );
        }
    }

    // Delete database records
    await prisma.$transaction(async (tx) => {

        await tx.profile.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.authAccount.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.like.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.comment.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.notification.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.refreshToken.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.friendRequest.deleteMany({
            where: {
                OR: [
                    { senderId: user_id },
                    { receiverId: user_id }
                ]
            }
        });

        await tx.friendship.deleteMany({
            where: {
                OR: [
                    { user1Id: user_id },
                    { user2Id: user_id }
                ]
            }
        });

        await tx.message.deleteMany({
            where: {
                senderId: user_id
            }
        });

        await tx.chat.deleteMany({
            where: {
                OR: [
                    { user1Id: user_id },
                    { user2Id: user_id }
                ]
            }
        });

        await tx.post.deleteMany({
            where: {
                userId: user_id
            }
        });

        await tx.user.delete({
            where: {
                id: user_id
            }
        });
    });

    res.status(200).json({
        message: "The user account is deleted successfully"
    });
});