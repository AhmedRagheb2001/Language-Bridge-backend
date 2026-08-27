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
import {createCommentSchema,updateCommentSchema} from "../Schemas/commentSchemas.mjs";
//@desc Get all the comments on a specific post
//@route GET /api/v1/posts/:post_id/comments
//@access Private (needs an access token)
export const getAllComments = asyncHandler(async(req,res) => {
    const {post_id} = req.params;
    if(!post_id)
    {
        res.status(400);
        throw new Error (`Please enter the post id`);
    }
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error(`The post is not found`);
    }
    const allComments = await prisma.comment.findMany({
        where : {postId : post_id},
        select :{
            id : true,
            content : true,
            userId : true,
            postId : true,
            user : {
                select :{
                    profile :{
                        select :{
                            displayName : true,
                            profilePictureUrl : true,
                        }
                    }
                }
            }
        }
    });
    res.status(200).json(allComments);
})

//@desc Create a new comment on a specific post
//@route POST /api/v1/posts/:post_id/comments
//@access Private (needs an access token)
export const createNewComment = asyncHandler(async (req,res) => {
    // res.status(200).json({message : `A comment has been created successfully`});
    const {post_id} = req.params;
    if(!post_id) {
        res.status(400);
        throw new Error (`Please enter the post id`);
    }
    const {error,value} = createCommentSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const{content} =value;
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error(`The post is not found`);
    }
    const newComment = await prisma.comment.create({
        data :{
            content,
            postId : post_id,
            userId : req.user.id
        },
        select : {
            id : true,
            content : true,
            postId : true,
            userId : true,
            createdAt : true,
            user : {
                select :{
                    profile : {
                        select : {
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            }
        }
    });
    if(!newComment) {
        res.status(500);
        throw new Error(`The new Comment has not been added`);
    }
    res.status(201).json(newComment);
})

//@desc Update a specific comment on a specific post
//@route PATCH /api/v1/posts/:post_id/comments/:comment_id
//@access Private (needs an access token)
export const updateComment = asyncHandler (async (req,res) => {
    // res.status(200).json({message : `The comment has been updated successfully`});
    const {post_id, comment_id} = req.params;
    if(!post_id || !comment_id) {
        res.status(400);
        throw new Error("Please add the post id and the comment id");
    }
    const {error,value} = updateCommentSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail)=>detail.message).join(" , "));
    }
    const {content} = value;
    
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error("The post is not found");
    }
    const commentFound = await prisma.comment.findUnique({
        where : {id : comment_id}
    });
    if(!commentFound)
    {
        res.status(404);
        throw new Error("The comment is not found");
    }
    if(!req.user.id === commentFound.userId && !req.user.role === "ADMIN")
    {
        res.status(403);
        throw new Error("You are not allowed to do this action");
    }
    const updatedComment = await prisma.comment.update ({
        where : {id : comment_id,
                    postId : post_id
        },
        data : {
            content 
        },
        select : {
            id : true,
            content : true,
            createdAt : true,
            updatedAt : true,
            postId : true,
            userId : true,
            user : {
                select :
                {
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

    res.status(200).json(updatedComment);

})

//@desc Delete a specific comment on a specific post
//@route DELETE /api/v1/posts/:post_id/comments/comment_id
//@access Private (needs an access token)
export const deleteComment = asyncHandler (async(req,res) => {
    // res.status(200).json({message : 'The comment has been deleted successfully'});
    const {post_id, comment_id} = req.params;
    if(!post_id || !comment_id) {
        res.status(400);
        throw new Error("Please add the post id and the comment id");
    }
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error("The post is not found");
    }
    const commentFound = await prisma.comment.findUnique({
        where : {id : comment_id,
            postId : post_id
        }
    });
    if(!commentFound)
    {
        res.status(404);
        throw new Error("The comment is not found");
    }
    if(!req.user.id === commentFound.userId && !req.user.role === "ADMIN")
    {
        res.status(403);
        throw new Error("You are not allowed to do this action");
    }

    const deletedComment = await prisma.comment.delete({
        where : {id : comment_id}
    });

    res.sendStatus(204);
});


//@desc Get a specific comment on a specific post
//@route GET /api/v1/posts/:post_id/comments/comment_id
//@access Private (needs an access token)
export const getSpecificComment = asyncHandler (async (req,res) => {
    const {post_id, comment_id} = req.params;
    if(!post_id || !comment_id) {
        res.status(400);
        throw new Error ("Please add the post id and the comment id");
    }
    const postFound = await prisma.post.findUnique({
        where : {id : post_id}
    });
    if(!postFound)
    {
        res.status(404);
        throw new Error("The post is not found");
    }
    const commentFound = await prisma.comment.findUnique({
        where : {id : comment_id,
            postId : post_id
        },
        select :{
            id : true,
            content : true,
            postId : true,
            userId : true,
            user : {
                select :{
                    profile : {
                        select : {
                            displayName : true,
                            profilePictureUrl : true
                        }
                    }
                }
            }
        }
    });
    if(!commentFound)
    {
        res.status(404);
        throw new Error("The comment is not found");
    }
    res.status(200).json(commentFound);
})