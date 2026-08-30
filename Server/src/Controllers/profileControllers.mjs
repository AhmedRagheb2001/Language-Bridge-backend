import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import uploadToCloudinary from '../utils/uploadToCloudinary.mjs';
import deleteFromCloudinary from "../utils/deleteFromCloudinary.mjs";
import dotenv from 'dotenv';
dotenv.config();
import {updatingProfileSchema} from "../Schemas/profileSchemas.mjs";
const adapter = new PrismaPg({
    connectionString : process.env.DATABASE_URL
});

const prisma = new PrismaClient ({
    adapter
});

//@desc Get all the profiles 
//@route GET /api/v1/profiles
//@access Private/Protected(needs only an access token)
export const getAllProfiles = asyncHandler (async(req,res) =>{
    const {search,sort,nativeLanguage,learningLanguage,order} = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const allProfiles = await prisma.profile.findMany({
        where : {
            ...(search && {
                displayName : {
                    contains : search
                }
            }),
            ...(nativeLanguage && {
                nativeLanguage
            }),
            ...(learningLanguage && {
                learningLanguage
            })
        },
        ...(sort && {
            orderBy : {
                [sort] : order === "desc" ? "desc" : "asc"
            }
        }),
        skip : (page-1) * limit,
        take : limit,
        select : {
            id : true , 
            displayName : true,
            profilePictureUrl : true,
            nativeLanguage : true,
            learningLanguage : true,
            createdAt : true,
            userId : true
        }
        
    });
    res.status(200).json({
        message : "Here are all the profiles",
        allProfiles : allProfiles
    });
})

//@desc Get a specific profile
//@route GET /api/v1/users/:user_id/profile
//@access Private/Protected(needs only an access token)
export const getProfile = asyncHandler (async(req,res) => {
    const {user_id} = req.params;
    if(!user_id)
    {
        res.status(400);
        throw new Error("Please enter the user id");
    }
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
    const profileFound =  await prisma.profile.findUnique({
        where :{
            userId : user_id
        },
        select : {
            id : true,
            displayName : true,
            bio : true,
            profilePictureUrl : true,
            nativeLanguage : true,
            learningLanguage : true,
            userId : true
        }
    });
    res.status(200).json({
        message : "Here is the profile",
        profileFound : profileFound
    });
})

//@desc Update a specific profile
//@route PATCH /api/v1/profiles/me
//@access Private/Protected(needs only an access token, the ownership or the admin only can do this)
export const updateProfile = asyncHandler (async(req,res) => {
    const {error,value} = updatingProfileSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {displayName,bio,nativeLanguage,learningLanguage} = value;
    const profileFound = await prisma.profile.findUnique({
        where : {
            userId : req.user.id
        }
    });
    if(!profileFound)
    {
        res.status(404);
        throw new Error("The profile is not found");
    }
    if(profileFound.userId !== req.user.id && req.user.role !== "ADMIN")
    {
        res.status(403);
        throw new Error ("You don't have permissions to do this action");
    }
    const updatedProfile = await prisma.profile.update({
        where : {userId : req.user.id},
        data :{
            displayName ,
            bio,
            nativeLanguage,
            learningLanguage,
        },
        select :{
            id : true ,
            displayName : true,
            bio : true,
            profilePictureUrl : true,
            nativeLanguage: true,
            learningLanguage : true,
            createdAt : true,
            updatedAt : true
        }
    });
    res.status(200).json({
        message : "The prfile has been updated successfully",
        updatedProfile : updatedProfile
    });
});

//@desc Delete a specific profile
//@route DELETE /api/v1/profiles/me
//@access Private/Protected(needs only an access token, the ownership or the admin only can do this)
export const deleteProfile = asyncHandler (async(req,res) => {
    const profileFound = await prisma.profile.findUnique({
        where :{
            userId  : req.user.id
        }
    });
    if(!profileFound)
    {
        res.status(404);
        throw new Error("The profile is not found");
    }
    if (profileFound.profilePicturePublicId) {
    await deleteFromCloudinary(
        profileFound.profilePicturePublicId
    );
    }
    await prisma.profile.delete ({
        where : {
            userId : req.user.id
        }
    });
    res.status(200).json({
        message : "The profile has beem deleted successfully"
    });
})

//@desc Uploading a profile picture
//@route POST /api/v1/profiles/me/profilePicture
//@access Private/proteced 
export const uploadProfilePicture = asyncHandler (async (req,res) =>{
    if(!req.file)
    {
        res.status(400);
        throw new Error("Please upload your profile picture");
    }
    const profileFound = await prisma.profile.findUnique({
        where : {
            userId : req.user.id
        }
    });
    if(!profileFound)
    {
        res.status(404);
        throw new Error("The prfile is not found");
    }
    if(profileFound.profilePicturePublicId)
    {
        await deleteFromCloudinary(profileFound.profilePicturePublicId);
    }
    const buffer = req.file.buffer;
    const result = await uploadToCloudinary(buffer,"Language-Brideg/profilePictures");
    const updatedProfile = await prisma.profile.update({
        where : {
            id : profileFound.id
        },
        data : {
            profilePictureUrl : result.secure_url,
            profilePicturePublicId : result.public_id
        },
        select :{
            id : true,
            profilePictureUrl : true,
            profilePicturePublicId : true,
            userId : true
        }
    });
    res.status(200).json({
        message : "The profile picture has been updated successfully",
        updatedProfile
    });
})

//@desc Delete the profile picture
//@route DELETE /api/v1/profiles/me/profilePicture
//@access Private/Protected
export const deleteProfilePicture = asyncHandler (async(req,res) => {
    const profileFound = await prisma.profile.findUnique({
        where :{
            userId : req.user.id
        }
    });
    if(!profileFound)
    {
        res.status(404);
        throw new Error("The profile is not found");
    }
    if(!(profileFound.profilePicturePublicId))
    {
        res.status(404);
        throw new Error("The profile picture is not found");
    }
    await deleteFromCloudinary(
    profileFound.profilePicturePublicId
    );

    await prisma.profile.update({
        where : {
            userId : req.user.id
        },
        data :{
            profilePictureUrl : null,
            profilePicturePublicId : null
        }
    })
    res.status(200).json({
        message : "The profile picture has been removed successfully"
    });
})


//@desc Updating profile information
//@route PATCH /api/v1/profiles/:profile_id
//@access Private(needs JWT and the role must be an admin)

export const updateProfileInformation = asyncHandler(async(req,res)=>{
    const{profile_id} = req.params;
    if(!profile_id)
    {
        res.status(400);
        throw new Error("Please enter a profile id");
    }
    const {error,value} = updatingProfileSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {displayName,bio,nativeLanguage,learningLanguage} = value;
    const profileFound = await prisma.profile.findUnique({
        where : {
            userId : req.user.id
        }
    });
    if(!profileFound)
    {
        res.status(404);
        throw new Error("The profile is not found");
    }
    if(req.user.role !== "ADMIN")
    {
        res.status(403);
        throw new Error("You don't have permissions to perform this action");
    }
    const updatedProfile = await prisma.profile.update({
        where : {id : profile_id},
        data :{
            displayName ,
            bio,
            nativeLanguage,
            learningLanguage,
        },
        select :{
            id : true ,
            displayName : true,
            bio : true,
            profilePictureUrl : true,
            nativeLanguage: true,
            learningLanguage : true,
            createdAt : true,
            updatedAt : true
        }
    });
    res.status(200).json({
        message : "The prfile has been updated successfully",
        updatedProfile : updatedProfile
    });
});
