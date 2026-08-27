import asyncHandler from 'express-async-handler';
// import {PrismaClient} from '../generated/prisma/client.ts';
import { PrismaClient } from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import {registerSchema,loginSchema} from "../Schemas/authSchemas.mjs";
import {generateAccessToken,generateRefreshToken} from '../utils/generateTokens.mjs';
const adapter = new PrismaPg({
    connectionString : process.env.DATABASE_URL
});

const prisma = new PrismaClient ({
    adapter
});

//@desc Register a new user
//@route POST /api/v1/auth/register
//@access Public 
export const registerNewUser = asyncHandler(async(req,res)=>{
    const {error,value} = registerSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {email,username,password,displayName,bio,nativeLanguage,learningLanguage} = value;
    const emailFound = await prisma.user.findUnique({
        where : {email}
    });
    if(emailFound)
    {
        res.status(409);
        throw new Error("This email is already taken");
    }
    const usernameFound = await prisma.user.findUnique({
        where : {username}
    });
    if(usernameFound){
        res.status(409);
        throw new Error("This username is already taken");
    }
    const passwordHashed = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: passwordHashed,
            profile: {
            create: {
                displayName,
                bio,
                nativeLanguage,
                learningLanguage,
            },
            },
        },

        include: {
        profile: true,
        },
    });
        return res.status(201).json({
        message: "Registration successful",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role : user.role,
            profile: user.profile,
        },
        });
});
//@desc Login an existing user
//@route POST /api/v1/auth/login
//@access Public
export const loginUser = asyncHandler(async (req,res) => {
    const {error,value} = loginSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {email , password} = value;
    const userFound = await prisma.user.findUnique({
        where : {email}
});
    if(!userFound)
    {
        res.status(404);
        throw new Error(`This email is not found`);
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if(!isMatch)
    {
        res.status(401);
        throw new Error(`Invalid credentials`);
    }
    const accessToken = generateAccessToken(userFound);
    const refreshToken = generateRefreshToken(userFound);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data : {
            token : refreshToken,
            expiresAt : expiresAt,
            userId : userFound.id
        }
    })
    res.status(200).json({accessToken : accessToken,
        refreshToken : refreshToken
    });

})

//@desc Get the current user information (profile)
//@route GET /api/v1/auth/me
//@access Private(protected)
export const getCurrentUser = asyncHandler(async (req,res) => {
    // res.status(200).json({message : "This is the currenyt user information"});
    const user = await prisma.user.findUnique({
        where : {id : req.user.id},
        select : {
            id : true , 
            username : true , 
            email : true,
            profile :
            {
                select : {
                    id : true, 
                    displayName : true , 
                    profilePictureUrl : true,
                    bio : true,
                    nativeLanguage : true,
                    learningLanguage : true,
                    createdAt : true
                }
            }
        }
    });
    res.status(200).json(user);
})

//@desc Logout for an authenticated user
//@route POST /api/v1/auth/logout
//@access Private(protected)
export const logoutUser = asyncHandler (async (req,res)=> {
    const{ refreshToken} = req.body;
    if(!refreshToken)
    {
        res.status(400);
        throw new Error("Please enter the refresh token");
    }
    const refreshTokenFound = await prisma.refreshToken.findUnique({
        where : {
            token : refreshToken
        }
    });
    if(!refreshTokenFound)
    {
        res.status(404);
        throw new Error("This refresh Token is not found");
    }
    if(refreshTokenFound.userId !== req.user.id)
    {
        res.status(403);
        throw new Error("You don't have permissions to do this action");
    }
    if(refreshTokenFound.revoked)
    {
        res.status(409);
        throw new Error("The refresh token is already revoked");
    }
    await prisma.refreshToken.update({
        where : {
            id : refreshTokenFound.id
        },
        data : {
            revoked : true
        }
    });
    res.status(200).json({
        message : "The refresh token has been revoked successfully"
    });
})

//@desc refresh the token for an authenticated user
//@route POST /api/v1/auth/refresh-token
//@access public
//@desc Refresh the access token
//@route POST /api/v1/auth/refresh-token
//@access Public
export const refreshTheToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400);
        throw new Error("Please enter the refresh token");
    }

    let decoded;

    try {
        decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        res.status(403);
        throw new Error("Invalid or expired refresh token");
    }

    const refreshTokenFound = await prisma.refreshToken.findUnique({
        where: {
        token: refreshToken,
        },
    });

    if (!refreshTokenFound) {
        res.status(403);
        throw new Error("Invalid or malformed refresh token");
    }

    // 4. Check if token was revoked
    if (refreshTokenFound.revoked) {
        res.status(403);
        throw new Error("The refresh token is revoked");
    }

    // 5. Check database expiration
    if (refreshTokenFound.expiresAt < new Date()) {
        res.status(403);
        throw new Error("The refresh token is expired");
    }

    // 6. Make sure JWT user ID matches DB user ID
    if (decoded.id !== refreshTokenFound.userId) {
        res.status(403);
        throw new Error("Invalid refresh token");
    }

    // 7. Find the user
    const userFound = await prisma.user.findUnique({
        where: {
        id: refreshTokenFound.userId,
        },
        select: {
        id: true,
        username: true,
        email: true,
        role: true,
        },
    });

    if (!userFound) {
        res.status(404);
        throw new Error("User not found");
    }

    // 8. Generate a new access token
    const accessToken = generateAccessToken(userFound);

    // 9. Send the new access token
    res.status(200).json({
        accessToken,
        refreshToken,
    });
});