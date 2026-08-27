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

//@desc Likes a specific post
//@route POST  /api/v1/posts/:post_id/likes
//@access private (protected) needs an access token
export const likesPost = asyncHandler(async(req,res) => {
    // res.status(201).json({message : 'You liked this post successfully'});
    const {post_id} = req.params;
    if(!post_id)
    {
        res.status(400);
        throw new Error("Please add the post id");
    }
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error("The post is not found");
    }
        let newLike;

    try {
        newLike = await prisma.like.create({
            data: {
                postId: post_id,
                userId: req.user.id
            }
        });
    } catch (error) {
        if (error?.code === "P2002") {
        res.status(409);
        throw new Error("You have already liked this post");
    }

    throw error;
    }

    const totalLikes = await prisma.like.count({
        where : {postId : post_id}
    });
    res.status(201).json({
        message : "The user liked the post successfully",
        likeId : newLike.id,
        userId :newLike.userId,
        postId : newLike.postId,
        createdAt : newLike.createdAt,
        totalLikes : totalLikes,
        isLiked : true
    });
});


//@desc Dislikes a specific post
//@route DELETE  /api/v1/posts/:post_id/likes/:like_id
//@access private (protected) needs an access token
export const dislikesPost = asyncHandler(async(req,res) => {
    // res.status(201).json({message : 'You disliked this post successfully'});
    const {post_id} = req.params;
    if(!post_id )
    {
        res.status(400);
        throw new Error("Please add the post id and like id");
    }
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error("The post is not found");
    }
    const deletedLike = await prisma.like.delete({
        where : {
            postId_userId :{
                postId : post_id,
                userId : req.user.id
            }
        }
    });
    const totalLikes = await prisma.like.count({
        where : {postId : post_id}
    });
    res.status(200).json({
        message : "The user disliked the post successfully",
        likeId : deletedLike.id,
        userId :deletedLike.userId,
        postId : deletedLike.postId,
        createdAt : deletedLike.createdAt,
        totalLikes : totalLikes,
        isLiked : false
    });
});