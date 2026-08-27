import joi from "joi";

export const createCommentSchema = joi.object({
    content : joi.string().min(1).max(250).required()
}).unknown(false)

export const updateCommentSchema = joi.object({
    content : joi.string().min(1).max(250).required()
}).unknown(false)
