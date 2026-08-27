import joi from "joi";

export const createPostSchema = joi.object({
    title : joi.string().trim().min(1).max(100).required(),
    content : joi.string().trim().max(500)
}).unknown(false);

export const updatePostSchema = joi.object({
    title :  joi.string().trim().min(1).max(100),
    content : joi.string().trim().max(500)
}).unknown(false).min(1);