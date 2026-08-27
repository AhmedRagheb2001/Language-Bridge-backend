import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import uploadToCloudinary from "../utils/uploadToCloudinary.mjs";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.mjs";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();
import {createPostSchema,updatePostSchema} from "../Schemas/postSchemas.mjs";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});


// ============================================================
// HELPER: Add likedByMe to posts
// ============================================================
//
// This checks whether the currently authenticated user has
// liked each post.
//
// It is used by:
//   GET /posts
//   GET /posts/:post_id
//   GET /users/:user_id/posts
//
// ============================================================

async function addLikedByMe(posts, userId) {

    const postArray = Array.isArray(posts)
        ? posts
        : [posts];

    if (!postArray.length || !userId) {
        return posts;
    }

    const postIds = postArray.map(post => post.id);

    const myLikes = await prisma.like.findMany({
        where: {
            userId: String(userId),

            postId: {
                in: postIds
            }
        },

        select: {
            postId: true
        }
    });

    const likedPostIds = new Set(
        myLikes.map(like => String(like.postId))
    );

    return postArray.map(post => ({
        ...post,

        likedByMe: likedPostIds.has(
            String(post.id)
        )
    }));
}


// ============================================================
// GET ALL POSTS
// ============================================================
//
// @desc    Get all posts
// @route   GET /api/v1/posts/
// @access  Private
//
// ============================================================

export const getAllPosts = asyncHandler(async (req, res) => {

    const allPosts = await prisma.post.findMany({

        select: {

            id: true,

            title: true,

            content: true,

            createdAt: true,

            postPictureUrl: true,

            user: {

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

        },

        orderBy: {

            createdAt: "desc"

        }

    });


    // Add the current user's like state.
    const postsWithLikeState = await addLikedByMe(
        allPosts,
        req.user.id
    );


    res.status(200).json(postsWithLikeState);
});


// ============================================================
// GET SPECIFIC POST
// ============================================================
//
// @desc    Get a specific post
// @route   GET /api/v1/posts/:post_id
// @access  Private
//
// ============================================================

export const getSpecificPost = asyncHandler(async (req, res) => {

    const { post_id } = req.params;


    if (!post_id) {

        res.status(400);

        throw new Error(
            "Please enter a post Id"
        );

    }


    // --------------------------------------------------------
    // Check total likes
    // --------------------------------------------------------

    const totalLikes = await prisma.like.count({

        where: {

            postId: String(post_id)

        }

    });


    // --------------------------------------------------------
    // Check total comments
    // --------------------------------------------------------

    const totalComments = await prisma.comment.count({

        where: {

            postId: String(post_id)

        }

    });


    // --------------------------------------------------------
    // Find post
    // --------------------------------------------------------

    const postFound = await prisma.post.findUnique({

        where: {

            id: String(post_id)

        },

        select: {

            id: true,

            title: true,

            content: true,

            postPictureUrl: true,

            createdAt: true,

            updatedAt: true,

            user: {

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


    if (!postFound) {

        res.status(404);

        throw new Error(
            "The post is not found"
        );

    }


    // --------------------------------------------------------
    // Add likedByMe
    // --------------------------------------------------------

    const postWithLikeState = await addLikedByMe(
        postFound,
        req.user.id
    );


    // addLikedByMe returns an array when the input is an
    // object, so retrieve the first element.
    const finalPost = Array.isArray(postWithLikeState)
        ? postWithLikeState[0]
        : postWithLikeState;


    finalPost.totalLikes = totalLikes;

    finalPost.totalComments = totalComments;


    res.status(200).json(finalPost);
});


// ============================================================
// CREATE NEW POST
// ============================================================
//
// @desc    Create a new post
// @route   POST /api/v1/posts/
// @access  Private
//
// ============================================================

export const createNewPost = asyncHandler(async (req, res) => {

    const {error,value} = createPostSchema.validate(req.body);
    if(error)
    {
        res.status(400);
        throw new Error(error.details.map((detail) => detail.message).join(" , "));
    }
    const {
        title,
        content
    } = value;


    let postPictureUrl = null;

    let postPicturePublicId = null;


    // --------------------------------------------------------
    // Upload picture if supplied
    // --------------------------------------------------------

    if (req.file) {

        const buffer = req.file.buffer;


        const result = await uploadToCloudinary(
            buffer,
            "Language-Bridge/Post-Pictures"
        );


        postPictureUrl = result.secure_url;

        postPicturePublicId = result.public_id;

    }


    // --------------------------------------------------------
    // Create post
    // --------------------------------------------------------

    const newPost = await prisma.post.create({

        data: {

            title,

            content,

            postPictureUrl,

            postPicturePublicId,

            user: {

                connect: {

                    id: req.user.id

                }

            }

        },

        select: {

            id: true,

            title: true,

            content: true,

            postPictureUrl: true,

            createdAt: true,

            user: {

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


    // The creator obviously hasn't liked their new post.
    const postWithLikeState = {

        ...newPost,

        likedByMe: false,

        totalLikes: 0

    };


    res.status(201).json(postWithLikeState);
});


// ============================================================
// GET ALL USER POSTS
// ============================================================
//
// @desc    Get all posts belonging to a user
// @route   GET /api/v1/users/:user_id/posts
// @access  Private
//
// ============================================================

export const getUserPosts = asyncHandler(async (req, res) => {

    const { user_id } = req.params;


    if (!user_id) {

        res.status(400);

        throw new Error(
            "Please enter the user id"
        );

    }


    const allUserPosts = await prisma.post.findMany({

        where: {

            userId: String(user_id)

        },

        select: {

            id: true,

            title: true,

            content: true,

            postPictureUrl: true,

            createdAt: true,

            updatedAt: true,

            user: {

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

        },

        orderBy: {

            createdAt: "desc"

        }

    });


    // Add current user's like state.
    const postsWithLikeState = await addLikedByMe(
        allUserPosts,
        req.user.id
    );


    res.status(200).json(postsWithLikeState);
});


// ============================================================
// UPDATE POST
// ============================================================
//
// @desc    Edit a specific post
// @route   PATCH /api/v1/posts/:post_id
// @access  Private
//
// Owner OR ADMIN
//
// ============================================================

export const updatePost = asyncHandler(async (req, res) => {

    const { post_id } = req.params;
    if (!post_id) {

        res.status(400);

        throw new Error(
            "Please enter the post id"
        );

    }
    const {error,value} = updatePostSchema.validate(req.body);
    const {
        title,
        content
    } =value;



    const postFound = await prisma.post.findUnique({

        where: {

            id: String(post_id)

        },

        select: {

            id: true,

            userId: true

        }

    });


    if (!postFound) {

        res.status(404);

        throw new Error(
            "The post is not found"
        );

    }


    // --------------------------------------------------------
    // Permission check
    // --------------------------------------------------------

    if (
        String(req.user.id) !== String(postFound.userId) &&
        req.user.role !== "ADMIN"
    ) {

        res.status(403);

        throw new Error(
            "You are not allowed to do this"
        );

    }


    // --------------------------------------------------------
    // Update
    // --------------------------------------------------------

    const updatedPost = await prisma.post.update({

        where: {

            id: String(post_id)

        },

        data: {

            title,

            content

        },

        select: {

            id: true,

            title: true,

            content: true,

            postPictureUrl: true,

            createdAt: true,

            updatedAt: true,

            user: {

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


    // Preserve the current user's like state.
    const postWithLikeState = await addLikedByMe(
        updatedPost,
        req.user.id
    );


    const finalPost = Array.isArray(postWithLikeState)
        ? postWithLikeState[0]
        : postWithLikeState;


    res.status(200).json(finalPost);
});


// ============================================================
// DELETE POST
// ============================================================
//
// @desc    Delete a specific post
// @route   DELETE /api/v1/posts/:post_id
// @access  Private
//
// Owner OR ADMIN
//
// ============================================================

export const deletePost = asyncHandler(async (req, res) => {

    const { post_id } = req.params;


    if (!post_id) {

        res.status(400);

        throw new Error(
            "Please enter the post id"
        );

    }


    const postFound = await prisma.post.findUnique({

        where: {

            id: String(post_id)

        },

        select: {

            id: true,

            userId: true,

            postPicturePublicId: true

        }

    });


    if (!postFound) {

        res.status(404);

        throw new Error(
            "The post is not found"
        );

    }


    // --------------------------------------------------------
    // Permission check
    // --------------------------------------------------------

    if (
        String(req.user.id) !== String(postFound.userId) &&
        req.user.role !== "ADMIN"
    ) {

        res.status(403);

        throw new Error(
            "You are not allowed to do this"
        );

    }


    // --------------------------------------------------------
    // Delete Cloudinary image
    // --------------------------------------------------------

    if (postFound.postPicturePublicId) {

        await deleteFromCloudinary(
            postFound.postPicturePublicId
        );

    }


    // --------------------------------------------------------
    // Delete post
    // --------------------------------------------------------

    await prisma.post.delete({

        where: {

            id: String(post_id)

        }

    });


    res.status(200).json({

        message:
            "The post is deleted successfully"

    });
});


// ============================================================
// UPLOAD / REPLACE POST PICTURE
// ============================================================
//
// @desc    Upload/Replace a post picture
// @route   PATCH /api/v1/posts/:post_id/postPicture
// @access  Private
//
// Owner OR ADMIN
//
// ============================================================

export const uploadPostPicture = asyncHandler(async (req, res) => {

    const { post_id } = req.params;


    if (!post_id) {

        res.status(400);

        throw new Error(
            "Please enter the post id"
        );

    }


    if (!req.file) {

        res.status(400);

        throw new Error(
            "Please upload a post picture"
        );

    }


    const postFound = await prisma.post.findUnique({

        where: {

            id: String(post_id)

        }

    });


    if (!postFound) {

        res.status(404);

        throw new Error(
            "The post is not found"
        );

    }


    // --------------------------------------------------------
    // Permission check
    // --------------------------------------------------------

    if (
        String(req.user.id) !== String(postFound.userId) &&
        req.user.role !== "ADMIN"
    ) {

        res.status(403);

        throw new Error(
            "You don't have permissions to do this action"
        );

    }


    // --------------------------------------------------------
    // Upload new picture
    // --------------------------------------------------------

    const buffer = req.file.buffer;


    const result = await uploadToCloudinary(
        buffer,
        "Language-Bridge/Post-Pictures"
    );


    // --------------------------------------------------------
    // Update database
    // --------------------------------------------------------

    const updatedPostPicture = await prisma.post.update({

        where: {

            id: String(post_id)

        },

        data: {

            postPictureUrl: result.secure_url,

            postPicturePublicId: result.public_id

        },

        select: {

            id: true,

            postPictureUrl: true,

            updatedAt: true

        }

    });


    // --------------------------------------------------------
    // Delete old Cloudinary picture
    // --------------------------------------------------------

    if (postFound.postPicturePublicId) {

        await deleteFromCloudinary(
            postFound.postPicturePublicId
        );

    }


    res.status(200).json({

        message:
            "The post picture has been updated successfully",

        updatedPostPicture

    });
});


// ============================================================
// DELETE POST PICTURE
// ============================================================
//
// @desc    Delete a post picture
// @route   DELETE /api/v1/posts/:post_id/postPicture
// @access  Private
//
// Owner OR ADMIN
//
// ============================================================

export const deletePostPicture = asyncHandler(async (req, res) => {

    const { post_id } = req.params;


    if (!post_id) {

        res.status(400);

        throw new Error(
            "Please enter the post id"
        );

    }


    const postFound = await prisma.post.findUnique({

        where: {

            id: String(post_id)

        }

    });


    if (!postFound) {

        res.status(404);

        throw new Error(
            "The post is not found"
        );

    }


    // --------------------------------------------------------
    // Permission check
    // --------------------------------------------------------

    if (
        String(req.user.id) !== String(postFound.userId) &&
        req.user.role !== "ADMIN"
    ) {

        res.status(403);

        throw new Error(
            "You don't have permissions to do this action"
        );

    }


    if (!postFound.postPicturePublicId) {

        res.status(409);

        throw new Error(
            "The post already has no picture to remove"
        );

    }


    // --------------------------------------------------------
    // Delete Cloudinary picture
    // --------------------------------------------------------

    await deleteFromCloudinary(
        postFound.postPicturePublicId
    );


    // --------------------------------------------------------
    // Remove picture from database
    // --------------------------------------------------------

    await prisma.post.update({

        where: {

            id: String(post_id)

        },

        data: {

            postPictureUrl: null,

            postPicturePublicId: null

        }

    });


    res.status(200).json({

        message:
            "The post picture has been removed successfully"

    });
});